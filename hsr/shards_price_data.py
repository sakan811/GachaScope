from dataclasses import dataclass
from typing import List, Tuple


@dataclass
class ShardsPrice:
    """Represents an oneiric shards price list"""

    base_shards: int
    price: float
    extra_shards: int
    purchase_type: str = "normal"  # "normal" or "first_time_bonus"

    @property
    def total_shards(self) -> int:
        """Total shards including bonus"""
        return self.base_shards + self.extra_shards

    @property
    def shards_per_dollar(self) -> float:
        """Shards per dollar efficiency"""
        return self.total_shards / self.price


# Constants
SHARDS_PER_PULL = 160

normal_purchases = [
    ShardsPrice(60, 0.99, 0, "normal"),
    ShardsPrice(300, 4.99, 30, "normal"),
    ShardsPrice(980, 14.99, 110, "normal"),
    ShardsPrice(1980, 29.99, 260, "normal"),
    ShardsPrice(3280, 49.99, 600, "normal"),
    ShardsPrice(6480, 99.99, 1600, "normal"),
]

first_time_bonus = [
    ShardsPrice(60, 0.99, 60, "first_time_bonus"),
    ShardsPrice(300, 4.99, 300, "first_time_bonus"),
    ShardsPrice(980, 14.99, 980, "first_time_bonus"),
    ShardsPrice(1980, 29.99, 1980, "first_time_bonus"),
    ShardsPrice(3280, 49.99, 3280, "first_time_bonus"),
    ShardsPrice(6480, 99.99, 6480, "first_time_bonus"),
]


def calculate_optimal_cost(target_pulls: int, packages: List[ShardsPrice]) -> Tuple[float, List[Tuple[ShardsPrice, int]]]:
    """Calculate optimal cost for target pulls using dynamic programming"""
    target_shards = target_pulls * SHARDS_PER_PULL
    
    # Sort packages by efficiency (shards per dollar, descending)
    sorted_packages = sorted(packages, key=lambda x: x.shards_per_dollar, reverse=True)
    
    # Greedy approach: use most efficient packages first
    remaining_shards = target_shards
    total_cost = 0.0
    purchases = []
    
    for package in sorted_packages:
        if remaining_shards <= 0:
            break
            
        # Calculate how many of this package we need
        count = remaining_shards // package.total_shards
        if count > 0:
            purchases.append((package, count))
            total_cost += package.price * count
            remaining_shards -= package.total_shards * count
    
    # Handle remaining shards with the smallest package
    if remaining_shards > 0:
        smallest_package = min(packages, key=lambda x: x.total_shards)
        purchases.append((smallest_package, 1))
        total_cost += smallest_package.price
    
    return total_cost, purchases


def generate_pull_costs(max_pulls: int = 180) -> Tuple[List[float], List[float]]:
    """Generate costs for pulls 1 to max_pulls for both normal and first-time scenarios"""
    normal_costs = []
    first_time_costs = []
    
    for pulls in range(1, max_pulls + 1):
        normal_cost, _ = calculate_optimal_cost(pulls, normal_purchases)
        first_time_cost, _ = calculate_optimal_cost(pulls, first_time_bonus)
        
        normal_costs.append(normal_cost)
        first_time_costs.append(first_time_cost)
    
    return normal_costs, first_time_costs


# Pre-calculate costs for pulls 1-180
NORMAL_COSTS, FIRST_TIME_COSTS = generate_pull_costs(180)