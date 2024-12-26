import time
import statistics
import tracemalloc
import sys
from typing import Callable, List, Dict, Any
from memory_profiler import memory_usage

class PerformanceBenchmark:
    """
    Comprehensive performance benchmarking utility
    """
    def __init__(self, name: str):
        self.name = name
        self.results: Dict[str, Any] = {
            'name': name,
            'runs': [],
            'memory_usage': [],
            'performance_metrics': {}
        }

    def benchmark(self, func: Callable, *args, **kwargs):
        """
        Benchmark a single function with performance and memory tracking
        """
        # Start memory tracking
        tracemalloc.start()
        start_memory = tracemalloc.take_snapshot()

        # Time the function
        start_time = time.perf_counter()
        memory_before = memory_usage()[0]
        
        try:
            result = func(*args, **kwargs)
        except Exception as e:
            print(f"Error during benchmark: {e}")
            traceback.print_exc()
            return None

        # End timing
        end_time = time.perf_counter()
        memory_after = memory_usage()[0]

        # Get memory allocation
        end_memory = tracemalloc.take_snapshot()
        memory_diff = end_memory.compare_to(start_memory, 'lineno')
        total_memory_diff = sum(stat.size_diff for stat in memory_diff)

        # Record run
        run_metrics = {
            'execution_time': end_time - start_time,
            'memory_used': memory_after - memory_before,
            'memory_allocation_diff': total_memory_diff
        }
        self.results['runs'].append(run_metrics)

        return result

    def run_multiple_benchmarks(self, func: Callable, runs: int = 10, *args, **kwargs):
        """
        Run multiple benchmarks and collect statistics
        """
        for _ in range(runs):
            self.benchmark(func, *args, **kwargs)

        # Calculate performance metrics
        self._calculate_performance_metrics()
        return self.results

    def _calculate_performance_metrics(self):
        """
        Calculate statistical metrics from benchmark runs
        """
        if not self.results['runs']:
            return

        execution_times = [run['execution_time'] for run in self.results['runs']]
        memory_usages = [run['memory_used'] for run in self.results['runs']]
        memory_allocations = [run['memory_allocation_diff'] for run in self.results['runs']]

        self.results['performance_metrics'] = {
            'execution_time': {
                'mean': statistics.mean(execution_times),
                'median': statistics.median(execution_times),
                'min': min(execution_times),
                'max': max(execution_times),
                'standard_deviation': statistics.stdev(execution_times) if len(execution_times) > 1 else 0
            },
            'memory_usage': {
                'mean': statistics.mean(memory_usages),
                'median': statistics.median(memory_usages),
                'min': min(memory_usages),
                'max': max(memory_usages),
                'standard_deviation': statistics.stdev(memory_usages) if len(memory_usages) > 1 else 0
            },
            'memory_allocation': {
                'mean': statistics.mean(memory_allocations),
                'median': statistics.median(memory_allocations),
                'min': min(memory_allocations),
                'max': max(memory_allocations),
                'standard_deviation': statistics.stdev(memory_allocations) if len(memory_allocations) > 1 else 0
            }
        }

def example_performance_test():
    """
    Example performance test function
    """
    def test_function(size=10000):
        """
        Sample function to test performance
        """
        return [x**2 for x in range(size)]

    # Create benchmark
    benchmark = PerformanceBenchmark("List Comprehension Performance")
    
    # Run benchmarks
    results = benchmark.run_multiple_benchmarks(test_function)
    
    # Print results
    print("Performance Benchmark Results:")
    print(f"Function: {results['name']}")
    print("\nExecution Time Metrics (seconds):")
    for key, value in results['performance_metrics']['execution_time'].items():
        print(f"  {key}: {value}")
    
    print("\nMemory Usage Metrics (MiB):")
    for key, value in results['performance_metrics']['memory_usage'].items():
        print(f"  {key}: {value}")
    
    print("\nMemory Allocation Metrics (bytes):")
    for key, value in results['performance_metrics']['memory_allocation'].items():
        print(f"  {key}: {value}")

def main():
    """
    Run performance tests
    """
    example_performance_test()

if __name__ == "__main__":
    main()
