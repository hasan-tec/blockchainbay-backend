export default {
    routes: [
      {
        method: 'POST',
        path: '/giveaways/:id/pick-winner',
        handler: 'pick-winner.pickWinner',
        config: {
          policies: [],
        },
      },
    ],
  };