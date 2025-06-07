import streamlit as st
import pandas as pd
import numpy as np
from hsr.shards_price_data import NORMAL_COSTS, FIRST_TIME_COSTS, normal_purchases, first_time_bonus

def main():
    st.set_page_config(
        page_title="HSR Oneiric Shards Analysis",
        page_icon="⭐",
        layout="wide"
    )
    
    st.title("⭐ Honkai Star Rail - Oneiric Shards Cost Analysis")
    st.markdown("*Analysis of optimal spending for 1-180 pulls*")
    
    # Create data for visualization
    pulls = list(range(1, 181))
    
    # Main comparison chart
    st.header("📊 Cost Comparison: Normal vs First-Time Bonus")
    
    cost_df = pd.DataFrame({
        'Pulls': pulls,
        'Normal Packages': NORMAL_COSTS,
        'First-Time Bonus': FIRST_TIME_COSTS
    })
    
    st.line_chart(cost_df.set_index('Pulls'))
    
    # Savings analysis
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("💰 Savings from First-Time Bonus")
        savings = [normal - first_time for normal, first_time in zip(NORMAL_COSTS, FIRST_TIME_COSTS)]
        savings_df = pd.DataFrame({
            'Pulls': pulls,
            'Savings ($)': savings
        })
        st.line_chart(savings_df.set_index('Pulls'))
        
        # Max savings info
        max_savings_idx = savings.index(max(savings))
        st.metric(
            "Maximum Savings", 
            f"${max(savings):.2f}", 
            f"at {max_savings_idx + 1} pulls"
        )
    
    with col2:
        st.subheader("📈 Cost per Pull")
        cost_per_pull_normal = [cost / (i + 1) for i, cost in enumerate(NORMAL_COSTS)]
        cost_per_pull_first = [cost / (i + 1) for i, cost in enumerate(FIRST_TIME_COSTS)]
        
        cpp_df = pd.DataFrame({
            'Pulls': pulls,
            'Normal ($/pull)': cost_per_pull_normal,
            'First-Time ($/pull)': cost_per_pull_first
        })
        st.line_chart(cpp_df.set_index('Pulls'))
        
        # Efficiency metrics
        st.metric("Normal - 180 pulls", f"${cost_per_pull_normal[-1]:.2f}/pull")
        st.metric("First-Time - 180 pulls", f"${cost_per_pull_first[-1]:.2f}/pull")
    
    # Package efficiency analysis
    st.header("🎯 Package Efficiency Analysis")
    
    col3, col4 = st.columns(2)
    
    with col3:
        st.subheader("Normal Packages")
        normal_df = pd.DataFrame([
            {
                'Package': f"${p.price}",
                'Base Shards': p.base_shards,
                'Bonus Shards': p.extra_shards,
                'Total Shards': p.total_shards,
                'Shards/$': f"{p.shards_per_dollar:.1f}",
                'Cost/Pull': f"${p.price / (p.total_shards / 160):.2f}"
            }
            for p in normal_purchases
        ])
        st.dataframe(normal_df, use_container_width=True)
    
    with col4:
        st.subheader("First-Time Bonus Packages")
        first_time_df = pd.DataFrame([
            {
                'Package': f"${p.price}",
                'Base Shards': p.base_shards,
                'Bonus Shards': p.extra_shards,
                'Total Shards': p.total_shards,
                'Shards/$': f"{p.shards_per_dollar:.1f}",
                'Cost/Pull': f"${p.price / (p.total_shards / 160):.2f}"
            }
            for p in first_time_bonus
        ])
        st.dataframe(first_time_df, use_container_width=True)
    
    # Interactive cost calculator
    st.header("🧮 Pull Cost Calculator")
    
    target_pulls = st.slider("Target number of pulls:", 1, 180, 90)
    
    col5, col6, col7 = st.columns(3)
    
    with col5:
        normal_cost = NORMAL_COSTS[target_pulls - 1]
        st.metric("Normal Cost", f"${normal_cost:.2f}")
    
    with col6:
        first_time_cost = FIRST_TIME_COSTS[target_pulls - 1]
        st.metric("First-Time Cost", f"${first_time_cost:.2f}")
    
    with col7:
        savings_amount = normal_cost - first_time_cost
        savings_percent = (savings_amount / normal_cost) * 100
        st.metric("Savings", f"${savings_amount:.2f}", f"{savings_percent:.1f}%")
    
    # Key insights
    st.header("🔍 Key Insights")
    
    insights_col1, insights_col2 = st.columns(2)
    
    with insights_col1:
        st.markdown("""
        **Normal Packages:**
        - Most efficient: $99.99 package (81.6 shards/$)
        - Least efficient: $0.99 package (60.6 shards/$)
        - Best for: Regular spending
        """)
    
    with insights_col2:
        st.markdown("""
        **First-Time Bonus:**
        - Massive savings on all packages
        - Even small packages become very efficient
        - Must-buy for optimal spending
        """)
    
    # Summary statistics
    st.header("📋 Summary Statistics")
    
    summary_col1, summary_col2, summary_col3, summary_col4 = st.columns(4)
    
    with summary_col1:
        st.metric("180 Pulls (Normal)", f"${NORMAL_COSTS[-1]:.2f}")
    
    with summary_col2:
        st.metric("180 Pulls (First-Time)", f"${FIRST_TIME_COSTS[-1]:.2f}")
    
    with summary_col3:
        total_savings = NORMAL_COSTS[-1] - FIRST_TIME_COSTS[-1]
        st.metric("Total Savings", f"${total_savings:.2f}")
    
    with summary_col4:
        savings_percentage = (total_savings / NORMAL_COSTS[-1]) * 100
        st.metric("Savings %", f"{savings_percentage:.1f}%")


if __name__ == "__main__":
    main()