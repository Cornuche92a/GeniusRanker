
const getClientStats = async () => {

  return JSON.parse(JSON.stringify([
    {
      stats: '50',
      color: 'primary',
      icon: 'mdi:cart-plus',
      title: 'Services actifs',
      chipText: 'Last 4 Month'
    },
    {
      stats: '$930',
      color: 'warning',
      title: 'Valeur des services',
      icon: 'mdi:wallet-giftcard',
      chipText: 'Last One Year'
    },
    {
      icon: 'mdi:link',
      color: 'info',
      stats: '60',
      chipText: 'Cette année',
      title: 'Utilisations'
    },
    {
      stats: '€3.4k',
      color: 'success',
      icon: 'mdi:currency-eur',
      title: 'Mes économies',
      chipText: 'Last Six Months'
    }
  ]))


}

export default getClientStats
