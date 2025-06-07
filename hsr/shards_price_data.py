from dataclasses import dataclass


@dataclass
class ShardsPurchase:
    """Represents a shards purchase option"""

    base_shards: int
    price: float
    extra_shards: int
    purchase_type: str = "normal"  # "normal" or "first_time_bonus"


normal_purchases = [
    ShardsPurchase(60, 0.99, 0, "normal"),
    ShardsPurchase(300, 4.99, 30, "normal"),
    ShardsPurchase(980, 14.99, 110, "normal"),
    ShardsPurchase(1980, 29.99, 260, "normal"),
    ShardsPurchase(3280, 49.99, 600, "normal"),
    ShardsPurchase(6480, 99.99, 1600, "normal"),
]

first_time_bonus = [
    ShardsPurchase(60, 0.99, 0, "first_time_bonus"),
    ShardsPurchase(300, 4.99, 0, "first_time_bonus"),
    ShardsPurchase(980, 14.99, 0, "first_time_bonus"),
    ShardsPurchase(1980, 29.99, 0, "first_time_bonus"),
    ShardsPurchase(3280, 49.99, 0, "first_time_bonus"),
    ShardsPurchase(6480, 99.99, 0, "first_time_bonus"),
]
