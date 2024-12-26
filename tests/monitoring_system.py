import logging
import time
from datetime import datetime
from typing import Dict, Any, List
import psutil
import platform
import socket
import uuid

class SystemMetricsCollector:
    """
    Comprehensive system metrics collection and monitoring
    """
    def __init__(self, app_name: str = "DelilahAgentic"):
        self.app_name = app_name
        self.session_id = str(uuid.uuid4())
        self.start_time = time.time()

        # Configure logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            filename=f'{app_name}_system_metrics.log'
        )
        self.logger = logging.getLogger(__name__)

    def get_system_info(self) -> Dict[str, Any]:
        """
        Collect comprehensive system information
        """
        return {
            'session_id': self.session_id,
            'hostname': socket.gethostname(),
            'platform': platform.platform(),
            'python_version': platform.python_version(),
            'system': {
                'os': platform.system(),
                'release': platform.release(),
                'machine': platform.machine()
            }
        }

    def collect_performance_metrics(self) -> Dict[str, Any]:
        """
        Collect detailed system performance metrics
        """
        # CPU metrics
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_count = psutil.cpu_count()
        
        # Memory metrics
        memory = psutil.virtual_memory()
        
        # Disk metrics
        disk = psutil.disk_usage('/')

        return {
            'cpu': {
                'usage_percent': cpu_percent,
                'core_count': cpu_count
            },
            'memory': {
                'total': memory.total,
                'available': memory.available,
                'used': memory.used,
                'percent': memory.percent
            },
            'disk': {
                'total': disk.total,
                'used': disk.used,
                'free': disk.free,
                'percent': disk.percent
            }
        }

    def log_event(self, event_type: str, details: Dict[str, Any]):
        """
        Log system events with structured data
        """
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'session_id': self.session_id,
            'event_type': event_type,
            'details': details
        }
        self.logger.info(f"EVENT: {log_entry}")

class ApplicationHealthMonitor:
    """
    Monitor application health and generate comprehensive reports
    """
    def __init__(self, app_name: str = "DelilahAgentic"):
        self.app_name = app_name
        self.metrics_collector = SystemMetricsCollector(app_name)
        self.health_events: List[Dict[str, Any]] = []

    def record_health_event(self, 
                             event_type: str, 
                             status: str, 
                             details: Dict[str, Any] = None):
        """
        Record a health-related event
        """
        event = {
            'timestamp': datetime.now().isoformat(),
            'event_type': event_type,
            'status': status,
            'details': details or {}
        }
        self.health_events.append(event)
        self.metrics_collector.log_event(event_type, event)

    def generate_health_report(self) -> Dict[str, Any]:
        """
        Generate a comprehensive health report
        """
        # Collect system information
        system_info = self.metrics_collector.get_system_info()
        
        # Collect performance metrics
        performance_metrics = self.metrics_collector.collect_performance_metrics()

        # Analyze health events
        event_summary = self._analyze_health_events()

        return {
            'system_info': system_info,
            'performance': performance_metrics,
            'health_events': event_summary,
            'overall_status': self._determine_overall_health(event_summary)
        }

    def _analyze_health_events(self) -> Dict[str, Any]:
        """
        Analyze and summarize health events
        """
        event_types = {}
        status_counts = {}

        for event in self.health_events:
            # Count event types
            event_types[event['event_type']] = event_types.get(event['event_type'], 0) + 1
            
            # Count status
            status_counts[event['status']] = status_counts.get(event['status'], 0) + 1

        return {
            'total_events': len(self.health_events),
            'event_types': event_types,
            'status_counts': status_counts
        }

    def _determine_overall_health(self, event_summary: Dict[str, Any]) -> str:
        """
        Determine overall system health based on event analysis
        """
        if event_summary['total_events'] == 0:
            return 'HEALTHY'
        
        # Consider number of error events
        error_events = event_summary['status_counts'].get('ERROR', 0)
        warning_events = event_summary['status_counts'].get('WARNING', 0)

        if error_events > 10:
            return 'CRITICAL'
        elif error_events > 5 or warning_events > 20:
            return 'DEGRADED'
        
        return 'HEALTHY'

def main():
    """
    Demonstration of monitoring and health tracking
    """
    # Initialize health monitor
    health_monitor = ApplicationHealthMonitor()

    # Simulate some health events
    health_monitor.record_health_event(
        'DATABASE_CONNECTION', 
        'SUCCESS', 
        {'connection_time': 0.05, 'database': 'delilah_agentic_db'}
    )

    health_monitor.record_health_event(
        'API_REQUEST', 
        'SUCCESS', 
        {'endpoint': '/api/v1/assessments', 'response_time': 0.2}
    )

    # Simulate a warning event
    health_monitor.record_health_event(
        'RESOURCE_USAGE', 
        'WARNING', 
        {
            'cpu_usage': 85.5, 
            'memory_usage': 75.3, 
            'message': 'High resource utilization detected'
        }
    )

    # Simulate an error event
    health_monitor.record_health_event(
        'DATA_VALIDATION', 
        'ERROR', 
        {
            'validation_errors': ['Invalid patient age', 'Missing required fields'],
            'data_source': 'patient_registration'
        }
    )

    # Generate and print health report
    health_report = health_monitor.generate_health_report()
    
    print("Application Health Report:")
    print("------------------------")
    print(f"Overall Status: {health_report['overall_status']}")
    
    print("\nSystem Information:")
    for key, value in health_report['system_info'].items():
        print(f"{key}: {value}")
    
    print("\nPerformance Metrics:")
    for category, metrics in health_report['performance'].items():
        print(f"{category.upper()}:")
        for metric, value in metrics.items():
            print(f"  {metric}: {value}")
    
    print("\nHealth Events Summary:")
    events_summary = health_report['health_events']
    print(f"Total Events: {events_summary['total_events']}")
    
    print("Event Types:")
    for event_type, count in events_summary['event_types'].items():
        print(f"  {event_type}: {count}")
    
    print("Status Counts:")
    for status, count in events_summary['status_counts'].items():
        print(f"  {status}: {count}")

if __name__ == "__main__":
    main()
