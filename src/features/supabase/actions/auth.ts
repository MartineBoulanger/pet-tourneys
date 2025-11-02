'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createClient } from '../server';

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {
      status: error.message,
      user: null,
    };
  }

  const { data: existingUser } = await supabase
    .schema('api')
    .from('profiles')
    .select('*')
    .eq('email', credentials.email)
    .limit(1)
    .single();

  if (!existingUser) {
    const { error: userError } = await supabase
      .schema('api')
      .from('profiles')
      .insert({
        id: data?.user.id,
        email: credentials.email,
        username: data?.user.user_metadata.username,
        role: 'user',
        discord_id: null,
      });
    if (userError) {
      return {
        status: userError.message,
        user: null,
      };
    }
  }

  if (
    existingUser &&
    (existingUser.role === 'admin' || existingUser.role === 'author')
  ) {
    redirect('/admin');
  }

  revalidatePath('/', 'layout');
  return { status: 'success', user: data.user };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    username: formData.get('username') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        username: credentials.username,
        role: 'user',
      },
    },
  });

  if (error) {
    console.error('Sign-up error:', error);
    return {
      status: error.status,
      message: error.message,
    };
  } else if (data?.user?.identities?.length === 0) {
    return {
      status: 'User already exists, please login',
      user: null,
    };
  }

  revalidatePath('/', 'layout');
  return { status: 'success', user: data.user };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) redirect('/error');

  revalidatePath('/', 'layout');
  redirect('/');
}

// TODO: to check if 3 different functions are needed or not
// When a normal user is logged in
export async function getUserSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const { data: user, error: userError } = await supabase
    .schema('api')
    .from('profiles')
    .select('*')
    .eq('id', data?.user.id)
    .limit(1)
    .single();
  if (userError) return null;
  return { status: 'success', user };
}

// When an admin is logged in
export async function getAdminSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const { data: admin, error: adminError } = await supabase
    .schema('api')
    .from('profiles')
    .select('*')
    .eq('id', data?.user.id)
    .eq('role', 'admin')
    .limit(1)
    .single();
  if (adminError) return null;
  return { status: 'success', admin };
}

// When an author is logged in
export async function getAuthorSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  const { data: author, error: authorError } = await supabase
    .schema('api')
    .from('profiles')
    .select('*')
    .eq('id', data?.user.id)
    .eq('role', 'author')
    .limit(1)
    .single();
  if (authorError) return null;
  return { status: 'success', author };
}

// To sign in with Discord
export async function signInWithDiscord() {
  const origin = (await headers()).get('origin');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect('/error');
  } else if (data.url) {
    redirect(data.url);
  }
}

export async function forgotPassword(formData: FormData) {
  const origin = (await headers()).get('origin');
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    formData.get('email') as string,
    {
      redirectTo: `${origin}/reset-password`,
    }
  );

  if (error) {
    return {
      status: error.message,
    };
  }

  return { status: 'success' };
}

export async function resetPassword(formData: FormData, code: string) {
  const supabase = await createClient();
  const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);
  if (codeError) {
    return {
      status: codeError.message,
    };
  }
  const { error } = await supabase.auth.updateUser({
    password: formData.get('password') as string,
  });
  if (error) {
    return {
      status: error.message,
    };
  }
  return { status: 'success' };
}
