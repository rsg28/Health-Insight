// Group health data by date for visualization
export const groupDataByDate = (data) => {
    const groupedData = {};
    
    data.forEach(entry => {
      const date = new Date(entry.timestamp).toLocaleDateString();
      
      if (!groupedData[date]) {
        groupedData[date] = [];
      }
      
      groupedData[date].push(entry);
    });
    
    return groupedData;
  };
  
  // Calculate averages for each metric by date
  export const calculateDailyAverages = (data) => {
    const groupedByDate = groupDataByDate(data);
    const averages = [];
    
    Object.keys(groupedByDate).forEach(date => {
      const entriesForDate = groupedByDate[date];
      
      // Calculate averages for each metric
      const dailySum = {};
      const dailyCount = {};
      
      entriesForDate.forEach(entry => {
        Object.keys(entry).forEach(key => {
          // Skip non-numeric values and metadata fields
          if (
            typeof entry[key] === 'number' && 
            key !== 'id' && 
            !key.includes('timestamp')
          ) {
            if (!dailySum[key]) {
              dailySum[key] = 0;
              dailyCount[key] = 0;
            }
            
            dailySum[key] += entry[key];
            dailyCount[key]++;
          }
        });
      });
      
      // Calculate average for each metric
      const dailyAverage = { date };
      
      Object.keys(dailySum).forEach(key => {
        dailyAverage[key] = dailySum[key] / dailyCount[key];
      });
      
      averages.push(dailyAverage);
    });
    
    // Sort by date
    return averages.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  // Format data for the line chart component
  export const formatDataForLineChart = (data, metric) => {
    // Early return if no data
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
        legend: [metric]
      };
    }
    
    // Sort data chronologically
    const sortedData = [...data].sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp) : new Date(a.date);
      const dateB = b.timestamp ? new Date(b.timestamp) : new Date(b.date);
      return dateA - dateB;
    });
    
    // Format dates properly for labels
    const labels = sortedData.map(entry => {
      const date = entry.timestamp ? new Date(entry.timestamp) : new Date(entry.date);
      return `${date.getMonth()+1}/${date.getDate()}`; // Format as MM/DD
    });
    
    // Extract the metric values
    const values = sortedData.map(entry => entry[metric] || 0);
    
    return {
      labels: labels,
      datasets: [
        {
          data: values,
          color: () => '#6200ee',
          strokeWidth: 2
        }
      ],
      legend: [metric]
    };
  };
  
  // Get basic insights based on recent data trends
  export const generateBasicInsights = (data, metric) => {
    if (!data || data.length < 3) {
      return "Not enough data to generate insights. Add more entries.";
    }
    
    const averages = calculateDailyAverages(data);
    
    // Look at the last few days
    const recentData = averages.slice(-5);
    
    // Check if there's a trend
    let trend = 0;
    for (let i = 1; i < recentData.length; i++) {
      if (recentData[i][metric] > recentData[i-1][metric]) {
        trend++;
      } else if (recentData[i][metric] < recentData[i-1][metric]) {
        trend--;
      }
    }
    
    // Generate insight based on trend
    if (trend > 0) {
      return `Your ${metric} has been increasing recently. Keep tracking to see if this trend continues.`;
    } else if (trend < 0) {
      return `Your ${metric} has been decreasing recently. Keep tracking to see if this trend continues.`;
    } else {
      return `Your ${metric} has been relatively stable recently.`;
    }
  };
  
  // Get health metric recommendations
  export const getHealthRecommendations = (metric, value) => {
    // Simple recommendation logic based on metric type
    switch(metric) {
      case 'steps':
        if (value < 5000) {
          return "Try to increase your daily steps. Aim for at least 7,500 steps for general health benefits.";
        } else if (value < 7500) {
          return "You're on the right track with your step count. The general recommendation is 7,500-10,000 steps daily.";
        } else {
          return "Great job staying active with your steps!";
        }
        
      case 'sleepHours':
        if (value < 7) {
          return "Most adults need 7-9 hours of sleep. Try to increase your sleep duration for better health.";
        } else if (value > 9) {
          return "You're getting plenty of sleep. Consistency is key for quality rest.";
        } else {
          return "You're getting the recommended 7-9 hours of sleep for adults. Great job!";
        }
        
      case 'waterIntake':
        if (value < 6) {
          return "Try to drink more water. The general recommendation is about 8 glasses (64 oz) daily.";
        } else {
          return "You're doing well with your water intake!";
        }
        
      case 'mood':
        if (value < 3) {
          return "Your mood has been on the lower side. Consider activities that boost your mental wellbeing.";
        } else if (value < 5) {
          return "Your mood is average. Self-care activities might help improve your overall wellbeing.";
        } else {
          return "Your mood is positive! Keep up whatever you're doing.";
        }
        
      default:
        return "Keep tracking your data to receive personalized insights.";
    }
  };