import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  StatusBar,
  Modal,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LineChartComponent from '../components/LineChartComponent';
import { getAllHealthData } from '../utils/storage';
import { formatDataForLineChart, generateBasicInsights, getHealthRecommendations } from '../utils/dataUtils';
import theme from '../utils/theme';
import FeedbackDialog from '../components/FeedbackDialog';
import InsightSourceBadge from '../components/InsightSourceBadge';
import ConfidenceIndicator from '../components/ConfidenceIndicator';
import { saveUserFeedback } from '../utils/storage';

const ChartsScreen = ({ route, navigation }) => {
  const [healthData, setHealthData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(
    route?.params?.initialMetric || 'steps'
  );
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [currentInsightType, setCurrentInsightType] = useState('');
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoContent, setInfoContent] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Function to load data from storage
  const loadData = async () => {
    setRefreshing(true);
    const data = await getAllHealthData();
    setHealthData(data);
    setRefreshing(false);
  };

  // Get average value for the selected metric
  const getAverageValue = () => {
    if (healthData.length === 0) return 0;
    
    const sum = healthData.reduce((acc, item) => acc + (item[selectedMetric] || 0), 0);
    return (sum / healthData.length).toFixed(1);
  };

  const getChartData = () => {
    return formatDataForLineChart(healthData, selectedMetric);
  };

  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'steps': return '';
      case 'sleepHours': return '';
      case 'waterIntake': return '';
      case 'mood': return '';
      default: return '';
    }
  };

  const getYAxisSuffix = () => {
    switch (selectedMetric) {
      case 'steps': return '';
      case 'sleepHours': return 'h';
      case 'waterIntake': return '';
      case 'mood': return '';
      default: return '';
    }
  };

  const getChartColor = () => {
    switch (selectedMetric) {
      case 'steps': return '#4CAF50';
      case 'sleepHours': return '#2196F3';
      case 'waterIntake': return '#00BCD4';
      case 'mood': return '#FF9800';
      default: return theme.colors.primary;
    }
  };

  const getMetricTitle = () => {
    switch (selectedMetric) {
      case 'steps': return 'Steps';
      case 'sleepHours': return 'Sleep Hours';
      case 'waterIntake': return 'Water Intake (glasses)';
      case 'mood': return 'Mood (1-5)';
      default: return selectedMetric;
    }
  };

  const getMetricIcon = () => {
    switch (selectedMetric) {
      case 'steps': return 'footsteps-outline';
      case 'sleepHours': return 'moon-outline';
      case 'waterIntake': return 'water-outline';
      case 'mood': return 'happy-outline';
      default: return 'stats-chart-outline';
    }
  };

  const getInsightConfidence = () => {
    // Calculate confidence based on data completeness and sample size
    if (healthData.length === 0) return 0;
    
    const confidence = Math.min(0.95, (healthData.length / 30) * 0.8);
    return Math.max(0.1, confidence);
  };

  const getInsightSource = () => {
    if (healthData.length >= 14) {
      return 'user_data';
    } else if (healthData.length >= 7) {
      return 'general';
    } else {
      return 'research';
    }
  };

  const handleOpenFeedback = (insightType) => {
    setCurrentInsightType(insightType);
    setShowFeedbackDialog(true);
  };

  const handleSubmitFeedback = async (feedback) => {
    await saveUserFeedback(feedback);
    Alert.alert(
      "Thank You",
      "Your feedback helps us improve the quality of insights.",
      [{ text: "OK" }]
    );
  };

  const handleShowInfo = (content) => {
    setInfoContent(content);
    setShowInfoModal(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={loadData}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Health Insights</Text>
            <TouchableOpacity 
              style={styles.infoButton}
              onPress={() => navigation.navigate('HowItWorks')}
            >
              <Ionicons name="information-circle-outline" size={24} color="rgba(255, 255, 255, 0.8)" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>View trends and patterns in your data</Text>
        </View>
        
        <View style={styles.metricsButtonContainer}>
          <TouchableOpacity 
            style={[
              styles.metricButton, 
              selectedMetric === 'steps' && [styles.selectedMetricButton, { backgroundColor: '#4CAF50' }],
            ]}
            onPress={() => setSelectedMetric('steps')}
          >
            <Ionicons 
              name="footsteps-outline"
              size={22}
              color={selectedMetric === 'steps' ? 'white' : '#4CAF50'}
            />
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'steps' && styles.selectedMetricButtonText
            ]}>Steps</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.metricButton, 
              selectedMetric === 'sleepHours' && [styles.selectedMetricButton, { backgroundColor: '#2196F3' }],
            ]}
            onPress={() => setSelectedMetric('sleepHours')}
          >
            <Ionicons 
              name="moon-outline"
              size={22}
              color={selectedMetric === 'sleepHours' ? 'white' : '#2196F3'}
            />
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'sleepHours' && styles.selectedMetricButtonText
            ]}>Sleep</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.metricButton, 
              selectedMetric === 'waterIntake' && [styles.selectedMetricButton, { backgroundColor: '#00BCD4' }],
            ]}
            onPress={() => setSelectedMetric('waterIntake')}
          >
            <Ionicons 
              name="water-outline"
              size={22}
              color={selectedMetric === 'waterIntake' ? 'white' : '#00BCD4'}
            />
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'waterIntake' && styles.selectedMetricButtonText
            ]}>Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.metricButton, 
              selectedMetric === 'mood' && [styles.selectedMetricButton, { backgroundColor: '#FF9800' }],
            ]}
            onPress={() => setSelectedMetric('mood')}
          >
            <Ionicons 
              name="happy-outline"
              size={22}
              color={selectedMetric === 'mood' ? 'white' : '#FF9800'}
            />
            <Text style={[
              styles.metricButtonText,
              selectedMetric === 'mood' && styles.selectedMetricButtonText
            ]}>Mood</Text>
          </TouchableOpacity>
        </View>
        
        {healthData.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="analytics-outline" size={60} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyStateTitle}>No data to visualize</Text>
            <Text style={styles.emptyStateText}>
              Add some health data to see your trends and insights
            </Text>
          </View>
        ) : (
          <View style={styles.chartsContainer}>
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Ionicons 
                  name={getMetricIcon()}
                  size={24}
                  color={getChartColor()}
                  style={styles.chartIcon}
                />
                <Text style={styles.chartTitle}>{getMetricTitle()} Over Time</Text>
              </View>
              
              <LineChartComponent
                data={getChartData()}
                color={getChartColor()}
                yAxisLabel={getYAxisLabel()}
                yAxisSuffix={getYAxisSuffix()}
              />
            </View>
            
            <View style={styles.insightCard}>
              <View style={styles.insightHeader}>
                <Ionicons name="bulb-outline" size={22} color={theme.colors.primary} />
                <Text style={styles.insightTitle}>Your Insights</Text>
                
                <TouchableOpacity 
                  style={styles.feedbackButton}
                  onPress={() => handleOpenFeedback('general')}
                >
                  <Ionicons name="chatbox-outline" size={18} color={theme.colors.text.secondary} />
                  <Text style={styles.feedbackText}>Feedback</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.insightRow}>
                <Text style={styles.insightLabel}>Average {getMetricTitle()}:</Text>
                <Text style={styles.insightValue}>
                  {getAverageValue()} {getYAxisSuffix()}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.confidenceRow}>
                <InsightSourceBadge 
                  source={getInsightSource()} 
                  onInfoPress={handleShowInfo}
                />
                
                <ConfidenceIndicator 
                  level={getInsightConfidence()} 
                  dataPoints={healthData.length}
                  onInfoPress={handleShowInfo}
                />
              </View>
              
              <View style={styles.insightContent}>
                <Ionicons 
                  name="analytics-outline" 
                  size={20} 
                  color={theme.colors.text.secondary}
                  style={styles.insightIcon}
                />
                <Text style={styles.insightText}>
                  {generateBasicInsights(healthData, selectedMetric)}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.insightContent}>
                <Ionicons 
                  name="information-circle-outline" 
                  size={20} 
                  color={getChartColor()}
                  style={styles.insightIcon}
                />
                <Text style={[styles.recommendationText, { color: getChartColor() }]}>
                  {getHealthRecommendations(selectedMetric, getAverageValue())}
                </Text>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.privacyNote}>
          <Ionicons name="shield-checkmark-outline" size={18} color={theme.colors.text.hint} />
          <Text style={styles.privacyText}>
            These insights are generated from your local data only.
          </Text>
        </View>
      </ScrollView>
      
      {/* Feedback Dialog */}
      <FeedbackDialog 
        visible={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        onSubmit={handleSubmitFeedback}
        insightType={currentInsightType}
      />
      
      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View style={styles.infoModalOverlay}>
          <View style={styles.infoModalContent}>
            <Text style={styles.infoModalTitle}>About This Insight</Text>
            <Text style={styles.infoModalText}>{infoContent}</Text>
            <TouchableOpacity 
              style={styles.infoModalButton}
              onPress={() => setShowInfoModal(false)}
            >
              <Text style={styles.infoModalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    paddingTop: 60, // Added more space at the top
    paddingBottom: theme.spacing.l,
    borderBottomLeftRadius: theme.borderRadius.l,
    borderBottomRightRadius: theme.borderRadius.l,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4, // Reduced space between title and subtitle
  },
  title: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.light,
  },
  subtitle: {
    fontSize: theme.typography.sizes.caption,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoButton: {
    padding: 4,
  },
  metricsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    marginHorizontal: theme.spacing.m,
    marginTop: 20, // Moved down to not overlap with header
    ...theme.shadows.medium,
  },
  metricButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
    paddingHorizontal: theme.spacing.s,
    borderRadius: theme.borderRadius.s,
    backgroundColor: theme.colors.background,
    minWidth: 70,
  },
  selectedMetricButton: {
    ...theme.shadows.small,
  },
  metricButtonText: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  selectedMetricButtonText: {
    color: theme.colors.text.light,
    fontWeight: theme.typography.fontWeights.medium,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.l,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.s,
  },
  emptyStateText: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  chartsContainer: {
    padding: theme.spacing.m,
    paddingTop: 10, // Reduced top padding
  },
  chartCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    marginBottom: theme.spacing.m,
    ...theme.shadows.small,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  chartIcon: {
    marginRight: theme.spacing.s,
  },
  chartTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  insightCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    ...theme.shadows.small,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  insightTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.s,
    flex: 1,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  feedbackText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginLeft: 4,
  },
  insightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  insightLabel: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
  },
  insightValue: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.bold,
    color: theme.colors.text.primary,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    marginVertical: theme.spacing.m,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightIcon: {
    marginRight: theme.spacing.s,
    marginTop: 2,
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  recommendationText: {
    flex: 1,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.fontWeights.medium,
    lineHeight: 20,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.divider,
    padding: theme.spacing.m,
    marginHorizontal: theme.spacing.m,
    marginVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.s,
  },
  privacyText: {
    marginLeft: theme.spacing.s,
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  infoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoModalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    ...theme.shadows.medium,
  },
  infoModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  infoModalText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.secondary,
    marginBottom: 16,
  },
  infoModalButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  infoModalButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default ChartsScreen;