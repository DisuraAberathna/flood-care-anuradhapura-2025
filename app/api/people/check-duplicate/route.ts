import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { gnList } from '@/lib/locations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, nic, address, location, divisionalSecretariat } = body;

    if (!name || !age || !address || !location) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Get MPA code and divisional secretariat from location
    // For duplicate check, we need exact match: GN name, MPA code, AND divisional secretariat
    if (!divisionalSecretariat) {
      return NextResponse.json({
        error: 'Divisional Secretariat is required for duplicate check',
      }, { status: 400 });
    }

    // Find the exact location item with matching GN name, divisional secretariat, and get MPA code
    const locationItem = gnList.find(
      item => item.gnName === location && item.divisionalSecretariat === divisionalSecretariat
    );

    if (!locationItem) {
      return NextResponse.json({
        error: 'Invalid location or divisional secretariat combination',
      }, { status: 400 });
    }

    const mpaCode = locationItem.mpaCode;

    // Build MongoDB query conditions
    const baseQuery: any = {
      name: name.trim(),
      age: Number(age),
      address: address.trim(),
      location: location,
    };

    // Add NIC condition - match if both have NIC or both don't have NIC
    let query: any;
    if (nic && nic.trim()) {
      query = {
        ...baseQuery,
        nic: nic.trim(),
      };
    } else {
      // Match if NIC is null, empty string, or not provided
      query = {
        ...baseQuery,
        $or: [
          { nic: null },
          { nic: '' },
          { nic: { $exists: false } }
        ]
      };
    }

    const collection = await getCollection();
    const rows = await collection.find(query).toArray();

    if (rows.length > 0) {
      // Filter results to match MPA code AND divisional secretariat
      const matchingRows = rows.filter((row: any) => {
        // Get all items with the same location name
        const existingLocationItems = gnList.filter(item => item.gnName === row.location);
        
        // Check if any existing item matches both MPA code AND divisional secretariat
        return existingLocationItems.some(item => 
          item.mpaCode === mpaCode && item.divisionalSecretariat === divisionalSecretariat
        );
      });

      if (matchingRows.length > 0) {
        // Convert MongoDB _id to id for the first matching row
        const { _id, ...rest } = matchingRows[0];
        const formattedPerson = {
          id: _id.toString(),
          ...rest,
        };

      return NextResponse.json({
        isDuplicate: true,
          existingPerson: formattedPerson,
      });
      }
    }

    return NextResponse.json({
      isDuplicate: false,
    });
  } catch (error: any) {
    console.error('Error checking duplicate:', error);
    return NextResponse.json(
      { error: 'Failed to check duplicate', details: error.message },
      { status: 500 }
    );
  }
}
