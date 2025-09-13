// Mock analytics
export const analyticsAdapter = {
  trackEvent(eventName: string, properties?: Record<string, any>) {
    if (__DEV__) {
      console.log(`Analytics Event: ${eventName}`, properties);
    }
  },

  trackScreenView(screenName: string, properties?: Record<string, any>) {
    this.trackEvent('screen_view', { screen: screenName, ...properties });
  },

  setUserProperties(properties: Record<string, any>) {
    if (__DEV__) {
      console.log('Analytics User Properties:', properties);
    }
  }
};
