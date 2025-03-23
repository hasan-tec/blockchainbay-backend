export default {
    giveawayStatusUpdater: {
      task: ({ strapi }) => {
        return async () => {
          try {
            const currentDate = new Date();
            console.log(`[Cron] Running giveaway status update: ${currentDate.toISOString()}`);
            
            // Fetch all giveaways
            const giveaways = await strapi.entityService.findMany('api::giveaway.giveaway', {
              fields: ['id', 'Title', 'StartDate', 'EndDate', 'GiveawayStatus'],
            });
            
            let updatesCount = 0;
            
            // Process each giveaway
            for (const giveaway of giveaways) {
              const startDate = new Date(giveaway.StartDate);
              const endDate = new Date(giveaway.EndDate);
              let newStatus = null;
              
              // Determine the correct status based on dates
              if (currentDate < startDate) {
                if (giveaway.GiveawayStatus !== 'upcoming') {
                  newStatus = 'upcoming';
                }
              } else if (currentDate > endDate) {
                if (giveaway.GiveawayStatus !== 'ended') {
                  newStatus = 'ended';
                }
              } else {
                if (giveaway.GiveawayStatus !== 'active') {
                  newStatus = 'active';
                }
              }
              
              // Update the status if needed
              if (newStatus) {
                await strapi.entityService.update('api::giveaway.giveaway', giveaway.id, {
                  data: {
                    GiveawayStatus: newStatus,
                    publishedAt: new Date().toISOString() // Add this line to publish the update
                  },
                });
                updatesCount++;
                console.log(`Updated giveaway ${giveaway.id} (${giveaway.Title || 'Untitled'}) status to ${newStatus}`);
              }
            }
            
            if (updatesCount > 0) {
              console.log(`Updated status for ${updatesCount} giveaways`);
            } else {
              console.log('No giveaway status updates needed');
            }
          } catch (error) {
            console.error('[Cron] Error updating giveaway statuses:', error);
          }
        };
      },
      options: {
        rule: '*/5 * * * *', // Run every 5 minutes
      },
    },
  };