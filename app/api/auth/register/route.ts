import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { User } from '@/lib/mongodb';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      isOnboarded: false,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    // Return user data without password
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isOnboarded: user.isOnboarded,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      { message: 'User created successfully', token, user: userData },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 