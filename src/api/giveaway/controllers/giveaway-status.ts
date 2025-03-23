export default {
    async updateStatus(ctx) {
      try {
        const { id } = ctx.params;
        const { status } = ctx.request.body;
        
        // Validate the status
        if (!['active', 'upcoming', 'ended'].includes(status)) {
          return ctx.badRequest('Invalid status. Must be one of: active, upcoming, ended');
        }
        
        // Update the giveaway status
        const result = await strapi.entityService.update('api::giveaway.giveaway', id, {
          data: {
            GiveawayStatus: status,
            publishedAt: new Date().toISOString() // Add this line to publish the update
          },
        });
        
        return result;
      } catch (error) {
        return ctx.badRequest(`Error updating status: ${error.message}`);
      }
    },
    
    async updateAllStatuses(ctx) {
      try {
        const currentDate = new Date();
        
        // Fetch all giveaways
        const giveaways = await strapi.entityService.findMany('api::giveaway.giveaway', {
          fields: ['id', 'Title', 'StartDate', 'EndDate', 'GiveawayStatus'],
        });
        
        const updates = [];
        
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
            const updated = await strapi.entityService.update('api::giveaway.giveaway', giveaway.id, {
              data: {
                GiveawayStatus: newStatus,
                publishedAt: new Date().toISOString() // Add this line to publish the update
              },
            });
            
            updates.push({
              id: giveaway.id,
              oldStatus: giveaway.GiveawayStatus,
              newStatus,
            });
          }
        }
        
        return { updates };
      } catch (error) {
        return ctx.badRequest(`Error updating statuses: ${error.message}`);
      }
    },
  };