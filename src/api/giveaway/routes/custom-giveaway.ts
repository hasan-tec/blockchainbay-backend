export default {
    routes: [
      {
        method: 'POST',
        path: '/giveaways/:slug/pick-winner',
        handler: 'custom-giveaway.pickWinner',
        config: {
          policies: [],
        },
      },
    ],
  };