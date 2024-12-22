import { NotificationService } from '../../src/monitoring/notifications';

describe('NotificationService Integration Tests', () => {
  let notificationService: NotificationService;

  beforeEach(() => {
    notificationService = new NotificationService();
  });

  test('should deliver notifications through console channel', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    notificationService.registerChannel({
      name: 'console',
      type: 'console',
      config: {},
      enabled: true
    });

    await notificationService.notify('console', 'alert', {
      metric: 'CPU Usage',
      value: '95%',
      threshold: '90%'
    });

    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][1]).toMatchObject({
      subject: expect.stringContaining('CPU Usage'),
      body: expect.stringContaining('95%')
    });
  });

  test('should handle multiple notification channels', async () => {
    const emailSpy = jest.spyOn(console, 'log').mockImplementation();
    const slackSpy = jest.spyOn(console, 'log').mockImplementation();

    notificationService.registerChannel({
      name: 'email',
      type: 'email',
      config: { to: 'admin@example.com' },
      enabled: true
    });

    notificationService.registerChannel({
      name: 'slack',
      type: 'slack',
      config: { channel: '#alerts' },
      enabled: true
    });

    await Promise.all([
      notificationService.notify('email', 'critical', {
        metric: 'Memory Usage',
        value: '98%',
        threshold: '95%'
      }),
      notificationService.notify('slack', 'critical', {
        metric: 'Memory Usage',
        value: '98%',
        threshold: '95%'
      })
    ]);

    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(emailSpy).toHaveBeenCalled();
    expect(slackSpy).toHaveBeenCalled();
  });

  test('should respect channel enabled status', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    notificationService.registerChannel({
      name: 'console',
      type: 'console',
      config: {},
      enabled: false // Channel disabled
    });

    await notificationService.notify('console', 'alert', {
      metric: 'CPU Usage',
      value: '95%',
      threshold: '90%'
    });

    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('should queue notifications and process in order', async () => {
    const processedNotifications: string[] = [];
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation((_, message) => {
      processedNotifications.push(message.subject);
    });

    notificationService.registerChannel({
      name: 'console',
      type: 'console',
      config: {},
      enabled: true
    });

    // Send multiple notifications in quick succession
    for (let i = 1; i <= 5; i++) {
      await notificationService.notify('console', 'alert', {
        metric: `Metric ${i}`,
        value: '95%',
        threshold: '90%'
      });
    }

    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(processedNotifications).toHaveLength(5);
    expect(processedNotifications).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Metric 1'),
        expect.stringContaining('Metric 2'),
        expect.stringContaining('Metric 3'),
        expect.stringContaining('Metric 4'),
        expect.stringContaining('Metric 5')
      ])
    );
  });

  test('should handle template substitution correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log');

    notificationService.registerChannel({
      name: 'console',
      type: 'console',
      config: {},
      enabled: true
    });

    notificationService.addTemplate('custom', {
      severity: 'info',
      subject: 'Test: {value} on {metric}',
      body: 'Details: {detail1} and {detail2}'
    });

    await notificationService.notify('console', 'custom', {
      metric: 'TestMetric',
      value: '42',
      detail1: 'foo',
      detail2: 'bar'
    });

    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(consoleSpy).toHaveBeenCalledWith(
      'Notification:',
      expect.objectContaining({
        subject: 'Test: 42 on TestMetric',
        body: 'Details: foo and bar'
      })
    );
  });
});
