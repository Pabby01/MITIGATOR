import { NextRequest, NextResponse } from 'next/server';
import {
  getAllVenues,
  getVenuesByCountry,
  getVenuesByRegion,
  getVenuesByCategory,
  searchVenues,
} from '@/lib/services/venues-directory-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get('country');
    const region = searchParams.get('region');
    const category = searchParams.get('category');
    const query = searchParams.get('q');
    const network = searchParams.get('network'); // 'devnet' | 'mainnet-beta'

    let results = getAllVenues();

    if (query) {
      results = searchVenues(query);
    }
    if (country && country !== 'all') {
      const countryResults = getVenuesByCountry(country);
      results = results.filter((r) => countryResults.some((c) => c.id === r.id));
    }
    if (region && region !== 'all') {
      results = results.filter((r) => r.region.toLowerCase().includes(region.toLowerCase()));
    }
    if (category && category !== 'all') {
      results = results.filter((r) => r.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (network && (network === 'devnet' || network === 'mainnet-beta')) {
      results = results.filter((r) => r.solanaNetworks.includes(network as any));
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      totalVenues: getAllVenues().length,
      venues: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch venues directory',
      },
      { status: 500 }
    );
  }
}
