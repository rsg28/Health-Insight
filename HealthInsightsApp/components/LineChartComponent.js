import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import theme from '../utils/theme';

const LineChartComponent = ({ 
  data, 
  title, 
  yAxisLabel = '', 
  yAxisSuffix = '', 
  color = theme.colors.primary 
}) => {
  
  // If no data is provided, display a message
  if (!data || !data.labels || data.labels.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No data available for chart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={Dimensions.get('window').width - (theme.spacing.m * 4)}
        height={220}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          backgroundColor: color,
          backgroundGradientFrom: color,
          backgroundGradientTo: color,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: theme.borderRadius.m,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#fff',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: 'rgba(255, 255, 255, 0.2)',
          },
          propsForLabels: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        fromZero={true}
        segments={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: theme.spacing.m,
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