/**
 * MITIGATOR — SEC EDGAR Authoritative Filings Service (Tier 1 Primary Data)
 * Connects to the public SEC EDGAR API for official 10-K, 10-Q, and 8-K corporate filings.
 */

export type SECFiling = {
  form: string;
  filingDate: string;
  accessionNumber: string;
  primaryDocument: string;
  description: string;
  url: string;
  tier: 'PRIMARY';
};

const CIK_MAP: Record<string, string> = {
  NVDAx: '0001045810',
  AAPLx: '0000320193',
  TSLAx: '0001318605',
  AMZNx: '0001018724',
  GOOGLx: '0001652044',
  MSFTx: '0000789019',
};

export async function getLiveSECFilings(symbol: string): Promise<SECFiling[]> {
  const cik = CIK_MAP[symbol] || CIK_MAP['NVDAx'];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`https://data.sec.gov/submissions/CIK${cik}.json`, {
      headers: {
        'User-Agent':
          process.env.SEC_EDGAR_USER_AGENT ||
          'MITIGATOR-App/1.0 (contact@mitigator.trade)',
        Accept: 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      const recent = data.filings?.recent;

      if (recent && recent.form && recent.form.length > 0) {
        const filings: SECFiling[] = [];
        const count = Math.min(recent.form.length, 5);

        for (let i = 0; i < count; i++) {
          const form = recent.form[i];
          const filingDate = recent.filingDate[i];
          const accNum = recent.accessionNumber[i];
          const accNumClean = accNum.replace(/-/g, '');
          const doc = recent.primaryDocument[i];

          filings.push({
            form,
            filingDate,
            accessionNumber: accNum,
            primaryDocument: doc,
            description: recent.primaryDocDescription[i] || `${form} Regulatory Filing`,
            url: `https://www.sec.gov/Archives/edgar/data/${parseInt(cik, 10)}/${accNumClean}/${doc}`,
            tier: 'PRIMARY',
          });
        }

        return filings;
      }
    }
  } catch (err) {
    console.warn('[SEC-EDGAR] Failed to fetch live filings for CIK:', cik, err);
  }

  return [];
}
