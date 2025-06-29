import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { Goal } from '@/lib/mongodb';
import { getUserFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get goals
    const goals = await Goal.find({ userId: user._id }).sort({ createdAt: -1 });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { title, description, category, targetDate } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json(
        { message: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    const goal = new Goal({
      userId: user._id,
      title,
      description,
      category,
      targetDate: targetDate ? new Date(targetDate) : undefined,
    });

    await goal.save();

    return NextResponse.json(
      { message: 'Goal created successfully', goal },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const { _id, title, description, category, targetDate, status, progress } = await request.json();

    if (!_id) {
      return NextResponse.json(
        { message: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Find and update goal
    const goal = await Goal.findOne({ _id, userId: user._id });
    if (!goal) {
      return NextResponse.json(
        { message: 'Goal not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (category !== undefined) goal.category = category;
    if (targetDate !== undefined) goal.targetDate = targetDate ? new Date(targetDate) : null;
    if (status !== undefined) goal.status = status;
    if (progress !== undefined) goal.progress = Math.max(0, Math.min(100, progress));

    await goal.save();

    return NextResponse.json(
      { message: 'Goal updated successfully', goal }
    );
  } catch (error) {
    console.error('Update goal error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 