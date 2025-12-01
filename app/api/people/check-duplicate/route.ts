import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { gnList, getGNItemByName } from '@/lib/locations';

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

    // Check for duplicate based on name, age, nic, address, and location
    // Build query conditions
    let query = `
      SELECT id, name, age, nic, address, location, created_at 
      FROM isolated_people 
      WHERE name = ? AND age = ? AND address = ? AND location = ?
    `;
    const params: any[] = [name.trim(), age, address.trim(), location];

    // Add NIC condition - match if both have NIC or both don't have NIC
    if (nic && nic.trim()) {
      query += ' AND nic = ?';
      params.push(nic.trim());
    } else {
      query += ' AND (nic IS NULL OR nic = "" OR nic = ?)';
      params.push('');
    }

    const [rows]: any = await pool.query(query, params);

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
        return NextResponse.json({
          isDuplicate: true,
          existingPerson: matchingRows[0],
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

