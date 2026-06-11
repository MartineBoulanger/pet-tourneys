import { getLiveSectionData } from '@/actions/supabase/api-schema/leagues/getLiveSectionData';
import type { LiveSectionData } from '@/types/supabase.types';
import { Heading, Container } from '@/components/ui';
import { RegionCard, PetBadge } from '@/components/layout';

export async function LiveSection() {
  const { data: liveData, success } = await getLiveSectionData();

  if (!success || !liveData) return null;

  const data: LiveSectionData = liveData;
  const {
    tournamentName,
    standingsByRegion,
    regions,
    topPetOverall,
    topPetByAffix,
    topPetByWeek,
    availableAffixes,
    availableWeeks,
  } = data;

  const hasPetData =
    topPetOverall || availableAffixes.length > 0 || availableWeeks.length > 0;

  return (
    <div className='bg-light-grey p-5'>
      <Container className='bg-background rounded-lg shadow-md my-0 p-2.5 lg:p-5 2xl:px-5 lg:my-5'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-2.5 lg:gap-5 w-full'>
          <div className='mb-5 lg:mb-0'>
            {/* Header */}
            <div className='mb-5'>
              <div className='flex items-center gap-2 mb-1'>
                {/* Live pulse indicator */}
                <span className='relative flex h-2.5 w-2.5'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-light-red opacity-75' />
                  <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-red' />
                </span>
                <span className='text-sm font-bold uppercase tracking-widest text-red'>
                  {'Live'}
                </span>
              </div>
              <Heading as='h2' className='text-2xl lg:text-4xl'>
                {tournamentName}
              </Heading>
            </div>

            {/* Pet stats */}
            {hasPetData && (
              <>
                <Heading
                  as='h3'
                  className='text-xs font-bold uppercase tracking-widest mb-2.5 lg:mb-5'
                >
                  {'Most Used Pet by...'}
                </Heading>
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                  {topPetOverall && (
                    <PetBadge pet={topPetOverall} label='Season' />
                  )}
                </div>
                {availableAffixes && (
                  <>
                    <div className='w-full h-0.5 my-2.5 sm:my-5 rounded-xl bg-medium-grey/50' />
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                      {availableAffixes.map((affix) =>
                        topPetByAffix[affix] ? (
                          <PetBadge
                            key={affix}
                            pet={topPetByAffix[affix]}
                            label={affix}
                          />
                        ) : null,
                      )}
                    </div>
                  </>
                )}
                {availableWeeks && (
                  <>
                    <div className='w-full h-0.5 my-2.5 sm:my-5 rounded-xl bg-medium-grey/50' />
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-2.5'>
                      {availableWeeks.map((week) =>
                        topPetByWeek[week] ? (
                          <PetBadge
                            key={week}
                            pet={topPetByWeek[week]}
                            label={`Week ${week}`}
                          />
                        ) : null,
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Standings grid */}
          <div className='flex flex-col'>
            {regions.length > 0 ? (
              <>
                <Heading
                  as='h3'
                  className='text-xs font-bold uppercase tracking-widest mb-2.5 lg:mb-5'
                >
                  {'Top 4 — by Region'}
                </Heading>
                <div className='grid sm:grid-cols-2 gap-2.5 lg:gap-5'>
                  {regions.map((region) => (
                    <RegionCard
                      key={region}
                      region={region}
                      standings={standingsByRegion[region] ?? []}
                    />
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </div>
      </Container>
    </div>
  );
}
