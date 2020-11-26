export default {
  menuItems: [
    {
      title: 'Контент',
      icon: 'mdi-chart-box-outline',
      color: 'primary',
      menuItems: [
        {
          title: 'Новости',
          icon: 'mdi-account-box-multiple-outline',
          uppercase: true,
          color: 'secondary',
          menuBadges: [{
            color: 'secondary',
            value: 'NEW',
          }],
          menuItems: [
            {
              title: 'Новости бизнеса',
              color: 'accent',
              menuBadges: [{
                color: 'primary',
                value: '45+',
              }],
              menuItems: [{
                title: 'Новости',
                color: 'primary',
                menuBadges: [{
                  color: 'secondary',
                  value: 'test',
                }],
                menuItems: [{
                  title: 'Test',
                  url: '/test1233',
                }],
              }],
            },
            {
              title: 'Новости компании',
              color: 'accent',
              url: '/test1',
              menuBadges: [
                {
                  color: 'test',
                  value: 'mdi-share-variant-outline',
                },
                {
                  color: 'link',
                  value: 'mdi-bell-outline',
                },
              ],
            },
          ],
        },
        {
          title: 'Статьи',
          color: 'primary',
          url: '/test3',
          menuBadges: [{
            color: 'accent',
          }],
        },
      ],
    },
    {
      title: '',
      divider: true,
      color: 'primary',
    },
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce non egestas orci. Suspendisse maximus eros in augue lacinia, bibendum placerat tellus mollis. ',
      icon: 'mdi-chart-box-outline',
      url: '/lorem-ipsum',
      color: 'primary',
    },
  ],
}
