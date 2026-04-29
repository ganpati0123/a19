import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useTheme } from '@theme/ThemeProvider';
import type {
  BillsStackParamList,
  HomeStackParamList,
  InvestStackParamList,
  RootTabParamList,
  ScanStackParamList,
  TransactionsStackParamList,
} from './types';

// Home stack screens
import { HomeScreen } from '@screens/home/HomeScreen';
import { ContactDetailScreen } from '@screens/home/ContactDetailScreen';
import { EnterAmountScreen } from '@screens/home/EnterAmountScreen';
import { PinScreen } from '@screens/home/PinScreen';
import { PaymentSuccessScreen } from '@screens/home/PaymentSuccessScreen';
import { ReceiptScreen } from '@screens/home/ReceiptScreen';
import { ShareReceiptScreen } from '@screens/home/ShareReceiptScreen';
import { BankAccountsScreen, BankDetailScreen } from '@screens/home/BankAccountsScreen';
import { ManageUpiScreen, UpiDetailScreen } from '@screens/home/ManageUpiScreen';
import { ProfileScreen, SettingsScreen, AppearanceScreen, SecurityScreen, NotificationsScreen } from '@screens/home/ProfileSettingsScreens';
import { RewardsScreen, RewardDetailScreen } from '@screens/home/RewardsScreen';
import { HelpScreen, HelpArticleScreen, ReferralsScreen } from '@screens/home/HelpScreens';
import { SplitGroupsScreen, SplitGroupDetailScreen, SplitMemberDetailScreen } from '@screens/home/SplitGroupScreens';
import { RequestMoneyScreen, RequestMoneyAmountScreen, RequestMoneyConfirmScreen } from '@screens/home/RequestMoneyScreens';
import { BudgetsScreen, BudgetDetailScreen } from '@screens/home/BudgetScreens';

// Scan stack screens
import { ScanScreen, ScanGalleryScreen } from '@screens/scan/ScanScreen';
import { MerchantDetailsScreen } from '@screens/scan/MerchantDetailsScreen';
import { ScanAmountScreen } from '@screens/scan/ScanAmountScreen';
import { PaymentMethodScreen } from '@screens/scan/PaymentMethodScreen';
import { ScanPinScreen } from '@screens/scan/ScanPinScreen';
import { ScanSuccessScreen } from '@screens/scan/ScanSuccessScreen';
import { MerchantRatingScreen } from '@screens/scan/MerchantRatingScreen';
import { MerchantOffersScreen, MerchantOfferDetailScreen, MerchantReviewsScreen, ReviewDetailScreen } from '@screens/scan/MerchantOffersScreen';

// Transactions stack screens
import { TransactionsListScreen } from '@screens/transactions/TransactionsListScreen';
import { TransactionDetailScreen } from '@screens/transactions/TransactionDetailScreen';
import { StatementScreen, StatementOptionsScreen } from '@screens/transactions/StatementScreen';
import { DisputeScreen, DisputeReasonScreen, DisputeConfirmScreen } from '@screens/transactions/DisputeScreens';
import { InsightsScreen, CategoryDetailScreen, CategoryTransactionsScreen, TransactionsFilterScreen } from '@screens/transactions/InsightsScreens';

// Bills stack screens
import { BillsHomeScreen } from '@screens/bills/BillsHomeScreen';
import {
  CategoryHomeScreen,
  OperatorScreen,
  OperatorPlansScreen,
  PlanDetailScreen,
  BillSummaryScreen,
  BillsPinScreen,
  BillsSuccessScreen,
  BillRemindersScreen,
  ReminderDetailScreen,
  AutoPayScreen,
  AutoPayDetailScreen,
} from '@screens/bills/CategoryFlowScreens';

// Invest stack screens
import { InvestHomeScreen } from '@screens/invest/InvestHomeScreen';
import {
  GoldScreen,
  GoldChartScreen,
  BuyGoldScreen,
  SellGoldScreen,
  GoldPaymentScreen,
  GoldPinScreen,
  GoldSuccessScreen,
} from '@screens/invest/GoldScreens';
import { PortfolioScreen, HoldingDetailScreen } from '@screens/invest/PortfolioScreens';
import {
  MutualFundsScreen,
  MutualFundDetailScreen,
  StartSipScreen,
  SipPaymentScreen,
  SipPinScreen,
  SipSuccessScreen,
} from '@screens/invest/MutualFundScreens';
import { InsuranceScreen, InsuranceDetailScreen, InsurancePurchaseScreen } from '@screens/invest/InsuranceScreens';
import { GoalsScreen, GoalDetailScreen } from '@screens/invest/GoalsScreens';
import { WatchlistScreen, WatchlistDetailScreen } from '@screens/invest/WatchlistScreens';

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ScanStack = createNativeStackNavigator<ScanStackParamList>();
const TxStack = createNativeStackNavigator<TransactionsStackParamList>();
const BillsStack = createNativeStackNavigator<BillsStackParamList>();
const InvestStack = createNativeStackNavigator<InvestStackParamList>();
const Tabs = createBottomTabNavigator<RootTabParamList>();

const stackScreenOptions = { headerShown: false, animation: 'slide_from_right' } as const;

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={stackScreenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="ContactDetail" component={ContactDetailScreen} />
      <HomeStack.Screen name="EnterAmount" component={EnterAmountScreen} />
      <HomeStack.Screen name="Pin" component={PinScreen} />
      <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <HomeStack.Screen name="Receipt" component={ReceiptScreen} />
      <HomeStack.Screen name="ShareReceipt" component={ShareReceiptScreen} />
      <HomeStack.Screen name="BankAccounts" component={BankAccountsScreen} />
      <HomeStack.Screen name="BankDetail" component={BankDetailScreen} />
      <HomeStack.Screen name="ManageUpi" component={ManageUpiScreen} />
      <HomeStack.Screen name="UpiDetail" component={UpiDetailScreen} />
      <HomeStack.Screen name="Profile" component={ProfileScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} />
      <HomeStack.Screen name="Appearance" component={AppearanceScreen} />
      <HomeStack.Screen name="Security" component={SecurityScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="Rewards" component={RewardsScreen} />
      <HomeStack.Screen name="RewardDetail" component={RewardDetailScreen} />
      <HomeStack.Screen name="Referrals" component={ReferralsScreen} />
      <HomeStack.Screen name="Help" component={HelpScreen} />
      <HomeStack.Screen name="HelpArticle" component={HelpArticleScreen} />
      <HomeStack.Screen name="SplitGroups" component={SplitGroupsScreen} />
      <HomeStack.Screen name="SplitGroupDetail" component={SplitGroupDetailScreen} />
      <HomeStack.Screen name="SplitMemberDetail" component={SplitMemberDetailScreen} />
      <HomeStack.Screen name="RequestMoney" component={RequestMoneyScreen} />
      <HomeStack.Screen name="RequestMoneyAmount" component={RequestMoneyAmountScreen} />
      <HomeStack.Screen name="RequestMoneyConfirm" component={RequestMoneyConfirmScreen} />
      <HomeStack.Screen name="Budgets" component={BudgetsScreen} />
      <HomeStack.Screen name="BudgetDetail" component={BudgetDetailScreen} />
    </HomeStack.Navigator>
  );
}

function ScanNavigator() {
  return (
    <ScanStack.Navigator screenOptions={stackScreenOptions}>
      <ScanStack.Screen name="Scan" component={ScanScreen} />
      <ScanStack.Screen name="ScanGallery" component={ScanGalleryScreen} />
      <ScanStack.Screen name="MerchantDetails" component={MerchantDetailsScreen} />
      <ScanStack.Screen name="ScanAmount" component={ScanAmountScreen} />
      <ScanStack.Screen name="ScanPaymentMethod" component={PaymentMethodScreen} />
      <ScanStack.Screen name="ScanPin" component={ScanPinScreen} />
      <ScanStack.Screen name="ScanSuccess" component={ScanSuccessScreen} />
      <ScanStack.Screen name="MerchantRating" component={MerchantRatingScreen} />
      <ScanStack.Screen name="MerchantOffers" component={MerchantOffersScreen} />
      <ScanStack.Screen name="MerchantOfferDetail" component={MerchantOfferDetailScreen} />
      <ScanStack.Screen name="MerchantReviews" component={MerchantReviewsScreen} />
      <ScanStack.Screen name="ReviewDetail" component={ReviewDetailScreen} />
    </ScanStack.Navigator>
  );
}

function TransactionsNavigator() {
  return (
    <TxStack.Navigator screenOptions={stackScreenOptions}>
      <TxStack.Screen name="TransactionsList" component={TransactionsListScreen} />
      <TxStack.Screen name="TransactionsFilter" component={TransactionsFilterScreen} />
      <TxStack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <TxStack.Screen name="DownloadStatement" component={StatementScreen} />
      <TxStack.Screen name="StatementOptions" component={StatementOptionsScreen} />
      <TxStack.Screen name="Dispute" component={DisputeScreen} />
      <TxStack.Screen name="DisputeReason" component={DisputeReasonScreen} />
      <TxStack.Screen name="DisputeConfirm" component={DisputeConfirmScreen} />
      <TxStack.Screen name="Insights" component={InsightsScreen} />
      <TxStack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
      <TxStack.Screen name="CategoryTransactions" component={CategoryTransactionsScreen} />
    </TxStack.Navigator>
  );
}

function BillsNavigator() {
  return (
    <BillsStack.Navigator screenOptions={stackScreenOptions}>
      <BillsStack.Screen name="BillsHome" component={BillsHomeScreen} />
      <BillsStack.Screen name="CategoryHome" component={CategoryHomeScreen} />
      <BillsStack.Screen name="Operator" component={OperatorScreen} />
      <BillsStack.Screen name="OperatorPlans" component={OperatorPlansScreen} />
      <BillsStack.Screen name="PlanDetail" component={PlanDetailScreen} />
      <BillsStack.Screen name="BillSummary" component={BillSummaryScreen} />
      <BillsStack.Screen name="BillsPin" component={BillsPinScreen} />
      <BillsStack.Screen name="BillsSuccess" component={BillsSuccessScreen} />
      <BillsStack.Screen name="BillReminders" component={BillRemindersScreen} />
      <BillsStack.Screen name="ReminderDetail" component={ReminderDetailScreen} />
      <BillsStack.Screen name="AutoPay" component={AutoPayScreen} />
      <BillsStack.Screen name="AutoPayDetail" component={AutoPayDetailScreen} />
    </BillsStack.Navigator>
  );
}

function InvestNavigator() {
  return (
    <InvestStack.Navigator screenOptions={stackScreenOptions}>
      <InvestStack.Screen name="InvestHome" component={InvestHomeScreen} />
      <InvestStack.Screen name="Gold" component={GoldScreen} />
      <InvestStack.Screen name="GoldChart" component={GoldChartScreen} />
      <InvestStack.Screen name="BuyGold" component={BuyGoldScreen} />
      <InvestStack.Screen name="SellGold" component={SellGoldScreen} />
      <InvestStack.Screen name="GoldPayment" component={GoldPaymentScreen} />
      <InvestStack.Screen name="GoldPin" component={GoldPinScreen} />
      <InvestStack.Screen name="GoldSuccess" component={GoldSuccessScreen} />
      <InvestStack.Screen name="Portfolio" component={PortfolioScreen} />
      <InvestStack.Screen name="HoldingDetail" component={HoldingDetailScreen} />
      <InvestStack.Screen name="MutualFunds" component={MutualFundsScreen} />
      <InvestStack.Screen name="MutualFundDetail" component={MutualFundDetailScreen} />
      <InvestStack.Screen name="StartSip" component={StartSipScreen} />
      <InvestStack.Screen name="SipPayment" component={SipPaymentScreen} />
      <InvestStack.Screen name="SipPin" component={SipPinScreen} />
      <InvestStack.Screen name="SipSuccess" component={SipSuccessScreen} />
      <InvestStack.Screen name="Insurance" component={InsuranceScreen} />
      <InvestStack.Screen name="InsuranceDetail" component={InsuranceDetailScreen} />
      <InvestStack.Screen name="InsurancePurchase" component={InsurancePurchaseScreen} />
      <InvestStack.Screen name="Goals" component={GoalsScreen} />
      <InvestStack.Screen name="GoalDetail" component={GoalDetailScreen} />
      <InvestStack.Screen name="Watchlist" component={WatchlistScreen} />
      <InvestStack.Screen name="WatchlistDetail" component={WatchlistDetailScreen} />
    </InvestStack.Navigator>
  );
}

const tabIcons: Record<keyof RootTabParamList, string> = {
  HomeTab: '🏠',
  ScanTab: '📷',
  TransactionsTab: '📊',
  BillsTab: '⚡',
  InvestTab: '💼',
};

const tabLabels: Record<keyof RootTabParamList, string> = {
  HomeTab: 'Home',
  ScanTab: 'Scan',
  TransactionsTab: 'History',
  BillsTab: 'Bills',
  InvestTab: 'Invest',
};

function TabIcon({ name, focused }: { name: keyof RootTabParamList; focused: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.tabIcon, focused && { backgroundColor: theme.colors.primarySoft }]}>
      <Text style={{ fontSize: focused ? 22 : 20 }}>{tabIcons[name]}</Text>
    </View>
  );
}

export function RootNavigator() {
  const theme = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.tabBarActive,
        tabBarInactiveTintColor: theme.colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 68,
          paddingTop: 6,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarLabel: tabLabels[route.name as keyof RootTabParamList],
        tabBarIcon: ({ focused }) => <TabIcon name={route.name as keyof RootTabParamList} focused={focused} />,
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeNavigator} />
      <Tabs.Screen name="ScanTab" component={ScanNavigator} />
      <Tabs.Screen name="TransactionsTab" component={TransactionsNavigator} />
      <Tabs.Screen name="BillsTab" component={BillsNavigator} />
      <Tabs.Screen name="InvestTab" component={InvestNavigator} />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    width: 44,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
});
