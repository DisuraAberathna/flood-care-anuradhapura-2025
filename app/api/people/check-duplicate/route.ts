import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { gnList } from '@/lib/locations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, age, nic, address, location } = body;

    if (!name || !age || !address || !location) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Get divisional secretariat from location
    const locationItem = gnList.find(item => item.gnName === location);
    const divisionalSecretariat = locationItem?.divisionalSecretariat || '';

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
      return NextResponse.json({
        isDuplicate: true,
        existingPerson: rows[0],
      });
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

