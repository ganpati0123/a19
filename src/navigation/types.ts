import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  ContactDetail: { contactId: string };
  EnterAmount: { contactId: string };
  Pin: { contactId: string; amount: number; note?: string };
  PaymentSuccess: { contactId: string; amount: number; transactionId: string };
  Receipt: { transactionId: string };
  ShareReceipt: { transactionId: string };
  BankAccounts: undefined;
  BankDetail: { bankId: string };
  ManageUpi: undefined;
  UpiDetail: { upiId: string };
  Profile: undefined;
  Settings: undefined;
  Appearance: undefined;
  Security: undefined;
  Notifications: undefined;
  Rewards: undefined;
  RewardDetail: { rewardId: string };
  Referrals: undefined;
  Help: undefined;
  HelpArticle: { articleId: string };
  SplitGroups: undefined;
  SplitGroupDetail: { groupId: string };
  SplitMemberDetail: { groupId: string; contactId: string };
  RequestMoney: undefined;
  RequestMoneyAmount: { contactId: string };
  RequestMoneyConfirm: { contactId: string; amount: number };
  Budgets: undefined;
  BudgetDetail: { budgetId: string };
};

export type ScanStackParamList = {
  Scan: undefined;
  ScanGallery: undefined;
  MerchantDetails: { merchantId: string };
  ScanAmount: { merchantId: string };
  ScanPaymentMethod: { merchantId: string; amount: number };
  ScanPin: { merchantId: string; amount: number; method: 'upi' | 'card' | 'wallet' | 'netbanking' };
  ScanSuccess: { merchantId: string; amount: number; transactionId: string };
  MerchantRating: { merchantId: string; transactionId: string };
  MerchantOffers: { merchantId: string };
  MerchantOfferDetail: { merchantId: string; offerId: string };
  MerchantReviews: { merchantId: string };
  ReviewDetail: { merchantId: string; reviewId: string };
};

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  TransactionsFilter: undefined;
  TransactionDetail: { transactionId: string };
  DownloadStatement: { transactionId?: string };
  StatementOptions: { format: 'pdf' | 'csv' | 'excel' };
  Dispute: { transactionId: string };
  DisputeReason: { transactionId: string; reasonId: string };
  DisputeConfirm: { transactionId: string; reasonId: string; description: string };
  Insights: undefined;
  CategoryDetail: { categoryId: string };
  CategoryTransactions: { categoryId: string };
};

export type BillsStackParamList = {
  BillsHome: undefined;
  CategoryHome: { category: string };
  Operator: { category: string; operatorId?: string };
  OperatorPlans: { operatorId: string; phone?: string };
  PlanDetail: { planId: string; phone?: string };
  BillSummary: { operatorId: string; planId?: string; phone?: string; amount: number };
  BillsPin: { operatorId: string; amount: number; planId?: string; phone?: string };
  BillsSuccess: { operatorId: string; amount: number; transactionId: string };
  BillReminders: undefined;
  ReminderDetail: { reminderId: string };
  AutoPay: undefined;
  AutoPayDetail: { mandateId: string };
};

export type InvestStackParamList = {
  InvestHome: undefined;
  Gold: undefined;
  GoldChart: undefined;
  BuyGold: undefined;
  SellGold: undefined;
  GoldPayment: { amount: number; grams: number };
  GoldPin: { amount: number; grams: number };
  GoldSuccess: { amount: number; grams: number; transactionId: string };
  Portfolio: undefined;
  HoldingDetail: { holdingId: string };
  MutualFunds: undefined;
  MutualFundDetail: { fundId: string };
  StartSip: { fundId: string };
  SipPayment: { fundId: string; amount: number };
  SipPin: { fundId: string; amount: number };
  SipSuccess: { fundId: string; amount: number; transactionId: string };
  Insurance: undefined;
  InsuranceDetail: { policyId: string };
  InsurancePurchase: { policyId: string };
  Goals: undefined;
  GoalDetail: { goalId: string };
  Watchlist: undefined;
  WatchlistDetail: { symbol: string };
};

export type RootTabParamList = {
  HomeTab: undefined;
  ScanTab: undefined;
  TransactionsTab: undefined;
  BillsTab: undefined;
  InvestTab: undefined;
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type ScanStackScreenProps<T extends keyof ScanStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ScanStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type TxStackScreenProps<T extends keyof TransactionsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<TransactionsStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type BillsStackScreenProps<T extends keyof BillsStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<BillsStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;

export type InvestStackScreenProps<T extends keyof InvestStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<InvestStackParamList, T>,
  BottomTabScreenProps<RootTabParamList>
>;
