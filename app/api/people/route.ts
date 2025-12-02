import { NextRequest, NextResponse } from 'next/server';
import { getCollection, initDatabase } from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
}

// GET - Fetch all people
export async function GET() {
  try {
    await ensureDbInitialized();
    const collection = await getCollection();
    const people = await collection.find({}).sort({ created_at: -1 }).toArray();
    
    // Convert MongoDB _id to id and ensure proper formatting
    const formattedPeople = people.map((person: any) => {
      const { _id, ...rest } = person;
      return {
        id: _id.toString(),
        ...rest,
        // Ensure lost_items and family_members are arrays or null
        lost_items: person.lost_items || null,
        family_members: person.family_members || null,
      };
    });
    
    return NextResponse.json(formattedPeople);
  } catch (error: any) {
    console.error('Error fetching people:', error);
    return NextResponse.json(
      { error: 'Failed to fetch people', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create a new person
export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized();
    const body = await request.json();
    const { name, age, nic, number_of_members, address, house_state, location, lost_items, family_members } = body;

    if (!name || !age || !address || !house_state || !location) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Auto-calculate number_of_members from family_members if provided
    // If no family members, default to 1 (the person themselves)
    let calculatedMembers = number_of_members;
    if (family_members && Array.isArray(family_members) && family_members.length > 0) {
      calculatedMembers = family_members.length;
    } else if (!calculatedMembers || calculatedMembers < 1) {
      calculatedMembers = 1; // Default to 1 if no family members provided
    }

    const now = new Date();
    
    const personData = {
      name: name.trim(),
      age: Number(age),
      nic: nic && nic.trim() ? nic.trim() : null,
      number_of_members: calculatedMembers,
      address: address.trim(),
      house_state: house_state.trim(),
      location: location.trim(),
      lost_items: lost_items && Array.isArray(lost_items) ? lost_items : null,
      family_members: family_members && Array.isArray(family_members) ? family_members : null,
      created_at: now,
      updated_at: now,
    };

    const collection = await getCollection();
    const result = await collection.insertOne(personData);

    return NextResponse.json(
      { id: result.insertedId.toString(), message: 'Person registered successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating person:', error);
    return NextResponse.json(
      { error: 'Failed to create person', details: error.message },
      { status: 500 }
    );
  }
}
