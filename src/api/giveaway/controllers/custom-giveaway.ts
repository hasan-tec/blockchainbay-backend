export default {
    async pickWinner(ctx) {
      const { slug } = ctx.params;
      const { strapi } = ctx;
      
      try {
        // Find the giveaway by slug
        const giveaways = await strapi.entityService.findMany('api::giveaway.giveaway', {
          filters: { slug },
        });
        
        if (!giveaways || giveaways.length === 0) {
          return ctx.notFound('Giveaway not found');
        }
        
        const giveaway = giveaways[0];
        
        // Check if giveaway has ended
        if (giveaway.GiveawayStatus !== 'ended') {
          return ctx.badRequest('Cannot pick a winner for a giveaway that has not ended');
        }
        
        // Get all entries for this giveaway
        const entries = await strapi.entityService.findMany('api::giveaway-entry-collection.giveaway-entry-collection', {
          filters: { giveaway: giveaway.id },
        });
        
        if (!entries || entries.length === 0) {
          return ctx.badRequest('No entries found for this giveaway');
        }
        
        // Select a random entry
        const randomIndex = Math.floor(Math.random() * entries.length);
        const winner = entries[randomIndex];
        
        // Update the giveaway with winner information
        await strapi.entityService.update('api::giveaway.giveaway', giveaway.id, {
          data: {
            winner_name: winner.Name,
            winner_email: winner.Email,
            winner_entry_id: winner.id,
          },
        });
        
        return winner;
      } catch (error) {
        console.error('Error picking winner:', error);
        return ctx.badRequest('Error selecting winner');
      }
    },
  };