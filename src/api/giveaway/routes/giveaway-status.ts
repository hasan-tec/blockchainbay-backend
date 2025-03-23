export default {
    routes: [
      {
        method: 'PUT',
        path: '/giveaways/:id/status',
        handler: 'giveaway-status.updateStatus',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/giveaways/update-statuses',
        handler: 'giveaway-status.updateAllStatuses',
        config: {
          policies: [],
        },
      },
    ],
  };