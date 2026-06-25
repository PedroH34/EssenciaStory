import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabaseConfig } from '@/lib/supabase/config';

export async function registerClick({
  productId,
  marketplace,
  url,
}: {
  productId: string;
  marketplace: 'mercado_livre' | 'shopee';
  url: string;
}) {
  if (!hasSupabaseConfig()) {
    redirect(url);
  }

  const headerStore = await headers();
  const supabase = await createClient();

  await supabase.from('clicks').insert({
    product_id: productId,
    marketplace,
    destination_url: url,
    user_agent: headerStore.get('user-agent'),
    referrer: headerStore.get('referer'),
  });

  redirect(url);
}
