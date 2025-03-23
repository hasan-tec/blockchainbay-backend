export default {
    async pickWinner(ctx) {
      try {
        const { id } = ctx.params;
        const { strapi } = ctx;
        
        // Find the giveaway by ID or slug
        let giveaway;
        
        // Try to find by slug first
        const giveawaysBySlug = await strapi.entityService.findMany('api::giveaway.giveaway', {
          filters: { slug: id },
        });
        
        if (giveawaysBySlug && giveawaysBySlug.length > 0) {
          giveaway = giveawaysBySlug[0];
        } else {
          // Try to find by ID
          try {
            giveaway = await strapi.entityService.findOne('api::giveaway.giveaway', id);
          } catch (e) {
            return ctx.notFound('Giveaway not found');
          }
        }
        
        if (!giveaway) {
          return ctx.notFound('Giveaway not found');
        }
        
        // Check if giveaway is ended
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
        return ctx.badRequest(`Error picking winner: ${error.message}`);
      }
    },
  };