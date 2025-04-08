import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../utils/theme';

const HowItWorksScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>How Health Insights Works</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Collection</Text>
          <Text style={styles.sectionText}>
            All data in Health Insights is manually entered by you. We don't collect any data 
            automatically or from other sources. This means the quality of insights depends on 
            the consistency and accuracy of your entries.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insight Generation</Text>
          <Text style={styles.sectionText}>
            Our insights come from three sources:
          </Text>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: theme.colors.primaryLight }]}>
              <Ionicons name="person" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>Your Personal Trends</Text>
              <Text style={styles.insightTypeText}>
                We analyze patterns in your historical data to identify trends and correlations.
                These insights become more accurate as you add more data.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: '#F0E6F6' }]}>
              <Ionicons name="globe" size={24} color="#8e44ad" />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>General Health Guidelines</Text>
              <Text style={styles.insightTypeText}>
                Some recommendations are based on commonly accepted health guidelines, 
                like drinking 8 glasses of water or taking 10,000 steps daily.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: '#E8F4FD' }]}>
              <Ionicons name="school" size={24} color="#2980b9" />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>Research-Based Insights</Text>
              <Text style={styles.insightTypeText}>
                We incorporate findings from peer-reviewed health research to provide
                evidence-based recommendations when available.
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local AI Processing with Ollama</Text>
          <Text style={styles.sectionText}>
            Health Insights uses Ollama, a powerful local AI framework, to generate personalized health insights 
            without compromising your privacy.
          </Text>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: '#E0F7FA' }]}>
              <Ionicons name="laptop" size={24} color="#00ACC1" />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>On-Device Processing</Text>
              <Text style={styles.insightTypeText}>
                Unlike most health apps, our AI runs completely on your computer - not on remote servers. 
                This means your sensitive health data never leaves your local network.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="shield" size={24} color="#43A047" />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>Privacy-First Architecture</Text>
              <Text style={styles.insightTypeText}>
                The app communicates with Ollama through a secure proxy that keeps all communication 
                within your home network, creating a privacy boundary that ensures your data remains under your control.
              </Text>
            </View>
          </View>
          
          <View style={styles.insightTypeContainer}>
            <View style={[styles.insightTypeIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="analytics" size={24} color="#EF6C00" />
            </View>
            <View style={styles.insightTypeContent}>
              <Text style={styles.insightTypeTitle}>Insight Generation Process</Text>
              <Text style={styles.insightTypeText}>
                When generating health insights, your data is securely sent from your phone to the Ollama service
                running on your computer. The AI analyzes patterns in your metrics and generates personalized
                recommendations.
              </Text>
            </View>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="information-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>
              While local AI processing may not match the capabilities of cloud-based systems, this tradeoff significantly 
              enhances your privacy and data security.
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidence Levels</Text>
          <Text style={styles.sectionText}>
            Each insight has a confidence indicator showing how reliable we believe
            the insight is based on:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>The number of data points available</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>The consistency in your data patterns</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>The time period covered by your data</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="checkmark-circle" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>The AI model's confidence in its analysis</Text>
          </View>
          
          <Text style={styles.sectionText}>
            Low confidence insights are still shown but should be considered preliminary
            until more data is available.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Privacy</Text>
          <Text style={styles.sectionText}>
            Your privacy is our top priority:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>All data is stored locally on your device only</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>AI processing happens on your local network, not on remote servers</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>You control when and how to export your data</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>You can delete your data anytime in Settings</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.sectionText}>
            By default, your data is kept indefinitely on your device. You can:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="time" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>Customize data retention periods in Privacy Settings</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="trash" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>Selectively delete specific data points or metrics</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="refresh" size={16} color={theme.colors.primary} />
            <Text style={styles.bulletText}>Set up automatic data cleanup after a specified period</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Limitations</Text>
          <Text style={styles.sectionText}>
            It's important to understand the limitations of Health Insights:
          </Text>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c" />
            <Text style={styles.bulletText}>This is not a medical application and doesn't provide medical advice</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c" />
            <Text style={styles.bulletText}>Insights are based on your self-reported data only</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c" />
            <Text style={styles.bulletText}>Local AI models may have limited capabilities compared to cloud services</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c" />
            <Text style={styles.bulletText}>General recommendations may not apply to your specific health needs</Text>
          </View>
          
          <View style={styles.bulletPoint}>
            <Ionicons name="alert-circle" size={16} color="#e74c3c" />
            <Text style={styles.bulletText}>Always consult healthcare professionals for medical concerns</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  insightTypeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  insightTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightTypeContent: {
    flex: 1,
  },
  insightTypeTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  insightTypeText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
    flex: 1,
    marginLeft: 8,
  },
});

export default HowItWorksScreen;