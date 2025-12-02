import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { ObjectId } from 'mongodb';

// GET - Fetch a single person by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await getCollection();
    
    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid person ID format' },
        { status: 400 }
      );
    }

    const person = await collection.findOne({ _id: new ObjectId(params.id) });

    if (!person) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB _id to id
    const { _id, ...rest } = person;
    const formattedPerson = {
      id: _id.toString(),
      ...rest,
      lost_items: person.lost_items || null,
      family_members: person.family_members || null,
    };

    return NextResponse.json(formattedPerson);
  } catch (error: any) {
    console.error('Error fetching person:', error);
    return NextResponse.json(
      { error: 'Failed to fetch person', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a person
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, age, nic, number_of_members, address, house_state, location, lost_items, family_members } = body;

    if (!name || !age || !address || !house_state || !location) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid person ID format' },
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

    const updateData = {
      name: name.trim(),
      age: Number(age),
      nic: nic && nic.trim() ? nic.trim() : null,
      number_of_members: calculatedMembers,
      address: address.trim(),
      house_state: house_state.trim(),
      location: location.trim(),
      lost_items: lost_items && Array.isArray(lost_items) ? lost_items : null,
      family_members: family_members && Array.isArray(family_members) ? family_members : null,
      updated_at: now,
    };
    
    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Person updated successfully' });
  } catch (error: any) {
    console.error('Error updating person:', error);
    return NextResponse.json(
      { error: 'Failed to update person', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a person
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate ObjectId format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid person ID format' },
        { status: 400 }
      );
    }

    const collection = await getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Person deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting person:', error);
    return NextResponse.json(
      { error: 'Failed to delete person', details: error.message },
      { status: 500 }
    );
  }
}
