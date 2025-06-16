import { EnhancedPlayerRecord } from '@/supabase/actions/players';

export const PlayerRankings = ({
  records,
}: {
  records: EnhancedPlayerRecord[];
}) => {
  console.log('player records:', { records });

  return <div>{'player rankings per region'}</div>;
};
