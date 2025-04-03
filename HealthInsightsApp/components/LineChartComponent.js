import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import theme from '../utils/theme';
import { useTheme } from '../utils/ThemeContext';

const LineChartComponent = ({ 
    data, 
    title, 
    yAxisLabel = '', 
    yAxisSuffix = '', 
    color = theme.colors.primary,
    metric = ''
  }) => {
    const { theme, isDarkMode } = useTheme();
    
    // If no data is provided, display a message
    if (!data || !data.labels || data.labels.length === 0) {
      return (
        <View style={[styles.noDataContainer, { backgroundColor: theme.colors.divider }]}>
          <Text style={[styles.noDataText, { color: theme.colors.text.secondary }]}>
            No data available for chart
          </Text>
        </View>
      );
    }

    // Calculate min and max values for y-axis
    const values = data.datasets[0].data;
    const maxValue = Math.max(...values);
    const minValue = metric === 'sleepHours' ? Math.min(...values) : 0;
    
    // Calculate good y-axis intervals
    const range = maxValue - minValue;
    const segments = 5;
    const stepSize = range / segments;
    
    // Create custom y-axis labels
    const yLabels = [];
    for (let i = 0; i <= segments; i++) {
      let value = minValue + (stepSize * i);
      if (metric === 'sleepHours') {
        value = Math.round(value * 10) / 10; // Round to 1 decimal for sleep hours
        yLabels.push(value.toFixed(1));
      } else {
        value = Math.round(value);
        yLabels.push(value.toString());
      }
    }
  
    return (
      <View style={styles.container}>
        {/* Custom Y-Axis Labels */}
        <View style={styles.chartContainer}>
          <View style={styles.yAxisContainer}>
            {yLabels.reverse().map((label, index) => (
              <View key={index} style={styles.yAxisLabelContainer}>
                <Text style={styles.yAxisLabel}>
                  {label}{yAxisSuffix}
                </Text>
              </View>
            ))}
          </View>
          
          <LineChart
            data={data}
            width={Dimensions.get('window').width - (theme.spacing.m * 4) - 40} // Reduce width to make room for our custom y-axis
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: color,
              backgroundGradientFrom: color,
              backgroundGradientTo: color,
              decimalPlaces: metric === 'sleepHours' ? 1 : 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: theme.borderRadius.m,
              },
              propsForDots: {
                r: '5',
                strokeWidth: '2',
                stroke: '#fff',
              },
              propsForBackgroundLines: {
                strokeDasharray: '',
                stroke: 'rgba(255, 255, 255, 0.2)',
              },
              propsForLabels: {
                fontSize: 11,
                fontWeight: '500',
              },
              // Turn off y-axis labels as we're using our custom ones
              yLabelsOffset: -10,
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            // We'll use our custom ranges instead
            fromZero={metric !== 'sleepHours'}
            segments={segments}
            // Calculate explicit min/max for y-axis
            yMin={minValue}
            yMax={maxValue}
            // Hide the built-in y-axis labels 
            hidePointsAtIndex={[]}
          />
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisContainer: {
    height: 220,
    justifyContent: 'space-between',
    marginRight: 5,
    width: 35,
  },
  yAxisLabelContainer: {
    alignItems: 'flex-end',
    height: 220 / 6,
    justifyContent: 'center',
  },
  yAxisLabel: {
    color: theme.colors.text.secondary,
    fontSize: 10,
  },
  chart: {
    borderRadius: theme.borderRadius.m,
    paddingRight: theme.spacing.m,
  },
  noDataContainer: {
    height: 220,
    width: '100%',
    backgroundColor: theme.colors.divider,
    borderRadius: theme.borderRadius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.m,
  },
  noDataText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
  },
});

export default LineChartComponent;