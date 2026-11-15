// ═══════════════════════════════════════════════════════════════════════════
// Crowdfunding-Back — تعاریف TypeScript تولیدشدهٔ خودکار از OpenAPI 3.1.0
// ⚠️  این فایل را دستکاری نکنید؛ با `make handoff` بازتولید میشود.
// منبع حقیقت: docs/api/v1/openapi.yaml
// ═══════════════════════════════════════════════════════════════════════════

export type ProblemCode =
  | "malformed_request"
  | "authentication_required"
  | "permission_denied"
  | "mfa_required"
  | "step_up_required"
  | "not_found"
  | "invalid_cursor"
  | "conflict"
  | "idempotency_conflict"
  | "idempotency_in_progress"
  | "resource_expired"
  | "validation_error"
  | "feature_disabled"
  | "rate_limited"
  | "service_overloaded"
  | "method_not_allowed"
  | "internal_error"
  | "invalid_phone"
  | "invalid_otp_code"
  | "otp_expired"
  | "otp_attempts_exceeded"
  | "otp_window_exceeded"
  | "invalid_mfa_code"
  | "mfa_locked"
  | "mfa_not_enrolled"
  | "mfa_already_enrolled"
  | "mfa_setup_missing"
  | "invalid_sheba"
  | "invalid_national_code"
  | "duplicate_national_code"
  | "reason_required"
  | "unknown_policy_key"
  | "cannot_revoke_current_session"
  | "user_inactive"
  | "sms_budget_exhausted"
  | "domain_error"
  | "csrf_failed"
  | "session_rotated";

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
  code: ProblemCode;
  instance: string;
  trace_id: string;
  errors?: Record<string, string[]>;
  retry_after?: number;
}

export interface CursorMeta {
  next: string | null;
  previous: string | null;
  page_size: number;
  total?: number;
}

/** نمای مدیریتی پرداخت با پوشاندن شماره موبایل خیر به صورت پیش‌فرض. */
export interface AdminPayment { id: string; contribution_id: string; gateway_name: string; authority: string; ref_id: string; status: PaymentStatusEnum; amount_rial: number; amount_toman: number; donor_phone_masked: string; donor_user_id: string; benefactor_name: string; target_title: string; verified_at: (string | null); created_at: string; }

/** ورودی درخواست مشاهدهٔ شمارهٔ کامل خیر با الزام ثبت هدف. */
export interface AdminPhoneRevealInputRequest { reason: string; }

/** ردیف تعهد در پنل مدیریت — با هویت خیر (ماسک‌شدهٔ امن). */
export interface AdminPledge { id: string; user_id: string; user_phone_masked: string; status: PledgeStatusEnum; target_kind: ContributionTargetKindEnum; target_title: string; amount_rial: number; amount_toman: number; frequency: PledgeFrequencyEnum; next_due_date: string; total_paid_rial: number; installments_paid: number; consecutive_failures: number; created_at: string; }

/** ورودی تغییر نقش کاربری با الزام دلیل. */
export interface AdminRoleChangeInputRequest { role: RoleEnum; reason: string; }

/** نمای کاربر برای میز عملیاتی ادمین (با شماره تلفن پوشانده در حالت عادی). */
export interface AdminUserOutput { id: string; masked_phone: string; first_name: string; last_name: string; display_name: string; province: string; city: string; role: RoleEnum; is_active: boolean; created_at: string; }

/** ورودی ساخت لینک سفیر اجتماعی برای حرکت یا قلک. */
export interface AmbassadorCreateInputRequest { campaign_id?: (string | null); charity_jar_id?: (string | null); custom_note?: string; }

/** خلاصهٔ اثر یک لینک سفیر اجتماعی. */
export interface AmbassadorImpactLinkOutput { code: string; target_title: string; click_count: number; referred_donors_count: number; attributed_shares: number; attributed_amount_rial: number; attributed_amount_toman: number; }

/** نمای خروجی لینک سفیر اجتماعی. */
export interface AmbassadorLink { id: string; code: string; campaign_id: (string | null); charity_jar_id: (string | null); target_title: string; custom_note: string; click_count: number; referred_donors_count: number; attributed_shares: number; attributed_amount_rial: number; attributed_amount_toman: number; created_at: string; }

/** تفکیک مبالغ ریالی/تومانی هدف، جمعآوریشده، مضاعف، آفلاین و تسویهشده. */
export interface AmountsBreakdownOutput { target_amount_rial: number; target_amount_toman: number; collected_online_rial: number; collected_online_toman: number; matched_amount_rial: number; matched_amount_toman: number; external_amount_rial: number; external_amount_toman: number; disbursed_to_benefactor_rial: number; disbursed_to_benefactor_toman: number; }

/** پاسخ راستی‌آزمایی زنجیرهٔ هش و لنگرها. */
export interface AuditChainVerification { chain_valid: boolean; first_broken_sequence: (number | null); anchors_valid: boolean; broken_anchors: Array<number>; total_records: number; }

/** نمای خروجی یک رکورد حسابرسی. */
export interface AuditRecord { id: string; sequence: number; action: string; outcome: string; actor_id: (string | null); actor_label: string; target_type: string; target_id: string; reason: string; metadata: unknown; request_id: string; previous_hash: string; record_hash: string; created_at: string; created_at_jalali: (string | null); }

/** ورودی بررسی سیگنال ریسک هویتی. */
export interface AuthRiskReviewInputRequest { status: AuthRiskReviewInputStatusEnum; note?: string; }

/** * `reviewed` - reviewed
* `dismissed` - dismissed */
export type AuthRiskReviewInputStatusEnum = "reviewed" | "dismissed";

/** نمای سیگنال ریسک احراز هویت. */
export interface AuthRiskSignalOutput { id: string; signal_type: string; status: RiskReviewStatusEnum; ip_address: (string | null); phone_masked: string; metadata: unknown; review_note: string; created_at: string; }

/** پاسخ ورود موفق شامل نشست، توکن‌های JWT و وضعیت MFA. */
export interface AuthTokensOutput { access_token: string; refresh_token: string; session_id: string; mfa_required: boolean; user: UserMeOutput; }

/** نمای مدیریتی خیریه شامل شماره شبا، شناسه ملی و وضعیت فعال بودن. */
export interface BenefactorAdmin { id: string; name: string; slug: string; registration_number: string; province: string; city: string; short_bio: string; description: string; logo_url: string; cover_url: string; website_url: string; is_verified: boolean; active_campaigns_count: number; completed_campaigns_count: number; total_raised_rial: number; total_raised_toman: number; total_disbursed_rial: number; total_disbursed_toman: number; jars: Array<Record<string, unknown>>; national_identifier: string; contact_phone: string; iban: string; bank_holder_name: string; is_active: boolean; display_order: number; created_at: string; created_at_jalali: (string | null); }

/** نمای عمومی خیریه بدون افشای شماره شبا یا اطلاعات بانکی حساس. */
export interface BenefactorPublic { id: string; name: string; slug: string; registration_number: string; province: string; city: string; short_bio: string; description: string; logo_url: string; cover_url: string; website_url: string; is_verified: boolean; active_campaigns_count: number; completed_campaigns_count: number; total_raised_rial: number; total_raised_toman: number; total_disbursed_rial: number; total_disbursed_toman: number; jars: Array<Record<string, unknown>>; }

/** ورودی ایجاد یا ویرایش خیریه توسط مدیر. */
export interface BenefactorWriteRequest { name: string; slug: string; registration_number?: string; national_identifier?: string; province?: string; city?: string; short_bio?: string; description?: string; logo_url?: string; cover_url?: string; website_url?: string; contact_phone?: string; iban?: string; bank_holder_name?: string; is_verified?: boolean; is_active?: boolean; display_order?: number; }

/** نمای دسته‌بندی موضوعی حرکت. */
export interface CampaignCategory { id: string; title: string; slug: string; icon_name: string; description: string; display_order: number; }

/** ورودی ایجاد دسته‌بندی موضوعی. */
export interface CampaignCategoryWriteRequest { title: string; slug: string; icon_name?: string; description?: string; display_order?: number; is_active?: boolean; }

/** نمای کامل صفحهٔ جزئیات حرکت شامل روایت چیستی‌وچرایی، گالری و تایم‌لاین پیشرفت میدانی. */
export interface CampaignDetail { id: string; title: string; slug: string; short_code: string; subtitle: string; cover_image_url: string; province: string; city: string; status: CampaignStatusEnum; urgency_level: CampaignUrgencyEnum; is_featured: boolean; benefactor: Record<string, unknown>; category: (Record<string, unknown> | null); total_shares: number; paid_shares: number; matched_shares: number; external_shares: number; reserved_shares: number; funded_shares: number; remaining_shares: number; progress_percent: number; physical_progress_percent: number; supporter_count: number; share_price_rial: number; share_price_toman: number; target_amount_rial: number; target_amount_toman: number; total_funded_rial: number; total_funded_toman: number; disbursed_amount_rial: number; disbursed_amount_toman: number; active_matching_grant: (Record<string, unknown> | null); ends_at: (string | null); ends_at_jalali: (string | null); created_at: string; created_at_jalali: (string | null); why_and_what: string; video_url: string; min_shares_per_order: number; max_shares_per_order: number; collected_online_rial: number; collected_online_toman: number; matched_amount_rial: number; matched_amount_toman: number; external_amount_rial: number; external_amount_toman: number; allow_anonymous: boolean; allow_dedication: boolean; media_items: Array<CampaignMedia>; impact_updates: Array<Record<string, unknown>>; starts_at: (string | null); completed_at: (string | null); has_financial_activity: boolean; }

/** نمای گزارش پیشرفت میدانی حرکت. */
export interface CampaignImpactUpdate { id: string; milestone_type: string; title: string; body: string; progress_percent: number; spent_amount_rial: number; spent_amount_toman: number; media_urls: Array<string>; created_at: string; created_at_jalali: (string | null); }

/** CampaignList */
export interface CampaignList { ordering: string; count: number; results: Array<CampaignSummary>; }

/** نمای آیتم رسانه در گالری حرکت. */
export interface CampaignMedia { id: string; kind: string; url: string; caption: string; display_order: number; }

/** آیتم ورودی رسانه هنگام ایجاد حرکت. */
export interface CampaignMediaInputRequest { kind?: KindEnum; url: string; caption?: string; display_order?: number; }

/** * `draft` - پیش‌نویس
* `active` - در حال جذب مشارکت
* `paused` - متوقف موقت
* `completed` - تکمیل ظرفیت سهم‌ها
* `executing` - در حال اجرای میدانی
* `fulfilled` - اجرا و گزارش نهایی شد
* `cancelled` - لغوشده */
export type CampaignStatusEnum = "draft" | "active" | "paused" | "completed" | "executing" | "fulfilled" | "cancelled";

/** نمای کارت خلاصهٔ حرکت برای فهرست‌های عمومی (با نمایش دوگانه ریال/تومان و سهم‌ها). */
export interface CampaignSummary { id: string; title: string; slug: string; short_code: string; subtitle: string; cover_image_url: string; province: string; city: string; status: CampaignStatusEnum; urgency_level: CampaignUrgencyEnum; is_featured: boolean; benefactor: Record<string, unknown>; category: (Record<string, unknown> | null); total_shares: number; paid_shares: number; matched_shares: number; external_shares: number; reserved_shares: number; funded_shares: number; remaining_shares: number; progress_percent: number; physical_progress_percent: number; supporter_count: number; share_price_rial: number; share_price_toman: number; target_amount_rial: number; target_amount_toman: number; total_funded_rial: number; total_funded_toman: number; disbursed_amount_rial: number; disbursed_amount_toman: number; active_matching_grant: (Record<string, unknown> | null); ends_at: (string | null); ends_at_jalali: (string | null); created_at: string; created_at_jalali: (string | null); }

/** یک ردیف از دیوار عمومی همراهان حرکت (با احترام به گمنامی خیر). */
export interface CampaignSupporterOutput { supporter_name: string; shares_count: number; matched_shares_awarded: number; public_note: (string | null); honoree_name: (string | null); paid_at: (string | null); paid_at_jalali: string; }

/** گزارش کامل شفافیت مالی و رمزنگاری یک حرکت خیرخواهانه. */
export interface CampaignTransparencyOutput { campaign_id: string; campaign_slug: string; campaign_title: string; benefactor_name: string; shares_breakdown: SharesBreakdownOutput; amounts_breakdown: AmountsBreakdownOutput; merkle_anchor: MerkleAnchorOutput | (unknown | null); external_contributions: Array<ExternalTransparencyItem>; }

/** * `normal` - عادی
* `urgent` - فوری
* `emergency` - اضطراری / حیاتی */
export type CampaignUrgencyEnum = "normal" | "urgent" | "emergency";

/** ورودی ایجاد حرکت خیرخواهانهٔ سهم‌محور توسط مدیر. */
export interface CampaignWriteRequest { benefactor_id: string; category_id?: (string | null); title: string; slug: string; short_code?: string; subtitle?: string; why_and_what?: string; cover_image_url?: string; video_url?: string; province?: string; city?: string; total_shares: number; share_price_rial: number; min_shares_per_order?: number; max_shares_per_order?: number; status?: CampaignStatusEnum; urgency_level?: CampaignUrgencyEnum; is_featured?: boolean; allow_anonymous?: boolean; allow_dedication?: boolean; starts_at?: (string | null); ends_at?: (string | null); media_items?: Array<CampaignMediaInputRequest>; }

/** نمای عمومی قلک عام خیریه با نمایش ریال و تومان. */
export interface CharityJarPublic { id: string; benefactor_id: string; benefactor_name: string; benefactor_slug: string; benefactor_logo_url: string; title: string; slug: string; short_code: string; description: string; suggested_amounts_rial: Array<number>; suggested_amounts_toman: Array<number>; min_amount_rial: number; min_amount_toman: number; max_amount_rial: number; max_amount_toman: number; monthly_goal_rial: number; monthly_goal_toman: number; total_raised_rial: number; total_raised_toman: number; donor_count: number; is_active: boolean; }

/** ورودی ایجاد قلک عام خیریه. */
export interface CharityJarWriteRequest { benefactor_id: string; title: string; slug: string; short_code?: string; description?: string; suggested_amounts_rial?: Array<number>; min_amount_rial?: number; max_amount_rial?: number; monthly_goal_rial?: number; is_active?: boolean; }

/** ورودی آغاز مشارکت و رزرو ۱۵ دقیقه‌ای سهم (یا واریز قلک عام) برای کاربر احراز هویت‌شده. */
export interface CheckoutInitiateInputRequest { target_kind?: ContributionTargetKindEnum; campaign_id?: (string | null); charity_jar_id?: (string | null); shares_count?: number; amount_rial?: number; is_anonymous?: boolean; public_note?: string; ambassador_code?: string; gateway_name?: GatewayNameEnum; dedication?: DedicationInputRequest; }

/** پاسخ ایجاد مشارکت و لینک هدایت به درگاه پرداخت. */
export interface CheckoutInitiateResponse { contribution_id: string; payment_id: string; authority: string; gateway_name: string; gateway_redirect_url: string; shares_count: number; amount_rial: number; amount_toman: number; hold_expires_at: string; }

/** * `campaign_shares` - خرید سهم از حرکت خیرخواهانه
* `charity_jar` - واریز آزاد به قلک عام خیریه */
export type ContributionTargetKindEnum = "campaign_shares" | "charity_jar";

/** نمای مشارکت در فهرست تاریخچهٔ کاربر. */
export interface ContributionUser { id: string; target_kind: string; target_title: string; benefactor_name: string; shares_count: number; matched_shares_awarded: number; amount_rial: number; amount_toman: number; is_anonymous: boolean; status: string; hold_expires_at: string; paid_at: (string | null); paid_at_jalali: (string | null); receipt_verification_code: (string | null); dedication_token: (string | null); }

/** کارنامهٔ کلی سفیر اجتماعی خیر. */
export interface DashboardAmbassadorImpactOutput { links_count: number; total_clicks: number; referred_donors_count: number; attributed_shares: number; attributed_amount_rial: number; attributed_amount_toman: number; links: Array<AmbassadorImpactLinkOutput>; }

/** انگیزهبخشی: استمرار ماهانه و نشانهای افتخار. */
export interface DashboardMotivationOutput { active_months_streak: number; earned_badges_count: number; total_badges_count: number; badges: Array<MotivationBadgeOutput>; }

/** کارنامهٔ کمی خیر (همهٔ مبالغ جفت ریال/تومان دارند). */
export interface DashboardSummaryOutput { total_contributions_count: number; campaign_shares_bought: number; matched_shares_unlocked: number; total_effective_shares: number; charity_jar_donations_count: number; charity_jar_total_rial: number; charity_jar_total_toman: number; total_contributed_rial: number; total_contributed_toman: number; total_impact_with_matching_rial: number; total_impact_with_matching_toman: number; backed_campaigns_count: number; completed_backed_campaigns_count: number; benefactors_supported_count: number; active_dedications_count: number; unread_notifications_count: number; }

/** هویت نمایشی خیر در داشبورد انگیزشی. */
export interface DashboardUserOutput { id: string; display_name: string; phone: string; }

/** گواهی عمومی نیتنامه/کارت هدیهٔ معنوی (بدون نمایش هیچ مبلغ ریالی). */
export interface DedicationCertificateOutput { public_token: string; dedication_type: string; honoree_name: string; dedicator_display_name: string; message: string; benefactor_name: string; benefactor_logo_url: (string | null); target_kind: string; target_title: string; target_slug: string; participation_badge: string; signature_hmac: string; issued_at: string; issued_at_jalali: string; }

/** ورودی اختیاری نیت‌نامه هنگام ثبت مشارکت. */
export interface DedicationInputRequest { dedication_type?: DedicationTypeEnum; honoree_name: string; dedicator_display_name?: string; message?: string; recipient_phone?: string; }

/** * `in_memory` - ثواب به یاد درگذشتگان و اموات
* `gift_honor` - هدیهٔ معنوی به عزیزان (تولد، سالگرد، قدردانی)
* `healing_prayer` - به نیت سلامتی و شفای بیماران
* `general_niyyat` - نیت قلبی و شکرگزاری */
export type DedicationTypeEnum = "in_memory" | "gift_honor" | "healing_prayer" | "general_niyyat";

/** ورودی ثبت درخواست تسویه جدید (Maker). */
export interface DisbursementCreateInputRequest { benefactor_id: string; campaign_id?: (string | null); amount_rial: number; request_note?: string; }

/** نمای خروجی درخواست تسویه با خیریه. */
export interface DisbursementRequest { id: string; benefactor_id: string; benefactor_name: string; campaign_id: (string | null); amount_rial: number; amount_toman: number; destination_iban: string; status: DisbursementStatusEnum; requested_by_id: string; request_note: string; reviewed_by_id: (string | null); reviewed_at: (string | null); review_reason: string; bank_reference_number: string; journal_entry_id: (string | null); created_at: string; created_at_jalali: (string | null); }

/** ورودی تأیید یا رد چهارچشمی درخواست تسویه (Checker + Step-Up MFA). */
export interface DisbursementReviewInputRequest { approve: boolean; reason: string; bank_reference_number?: string; }

/** * `pending_approval` - در انتظار تأیید مدیر مالی دوم
* `approved_paid` - تأیید و به حساب شبا واریز شد
* `rejected` - ردشده */
export type DisbursementStatusEnum = "pending_approval" | "approved_paid" | "rejected";

/** داشبورد جامع خیر: کارنامه، سفیر، انگیزه، رزروها، تایملاین و پیشنهادها. */
export interface DonorDashboardOutput { user: DashboardUserOutput; summary: DashboardSummaryOutput; ambassador_impact: DashboardAmbassadorImpactOutput; motivation: DashboardMotivationOutput; active_reservations: Array<Record<string, unknown>>; backed_campaigns: Array<Record<string, unknown>>; backed_impact_timeline: Array<Record<string, unknown>>; recent_contributions: Array<Record<string, unknown>>; recommended_campaigns: Array<Record<string, unknown>>; }

/** ورودی گام دوم مشارکت سریع ۳۰ ثانیه‌ای مهمان (کد ۵ رقمی OTP). */
export interface ExpressConfirmInputRequest { intent_id: string; code: string; }

/** ورودی گام اول مشارکت سریع ۳۰ ثانیه‌ای مهمان (همراه با شماره موبایل). */
export interface ExpressStartInputRequest { target_kind?: ContributionTargetKindEnum; campaign_id?: (string | null); charity_jar_id?: (string | null); shares_count?: number; amount_rial?: number; is_anonymous?: boolean; public_note?: string; ambassador_code?: string; gateway_name?: GatewayNameEnum; dedication?: DedicationInputRequest; phone: string; display_name?: string; }

/** پاسخ گام اول مشارکت سریع مهمان. */
export interface ExpressStartResponse { intent_id: string; expires_in: number; amount_rial: number; amount_toman: number; shares_count: number; dev_code?: string; }

/** نمای خروجی مشارکت خارج از درگاه. */
export interface ExternalContribution { id: string; campaign_id: string; shares_count: number; amount_rial: number; amount_toman: number; donor_display_name: string; reference_code: string; note: string; created_at: string; }

/** ورودی ثبت مشارکت خارج از درگاه آنلاین توسط مدیر. */
export interface ExternalContributionWriteRequest { shares_count: number; donor_display_name?: string; reference_code: string; note?: string; }

/** یک کمک ثبتشده خارج از درگاه در گزارش شفافیت عمومی. */
export interface ExternalTransparencyItem { donor_display_name: string; shares_count: number; amount_rial: number; amount_toman: number; reference_code: string; recorded_at_jalali: string; }

/** یک هشدار عملیاتی حلقهٔ پول (شدت، کد ماشین‌خوان و پیام فارسی). */
export interface FinancialAlert { severity: SeverityEnum; code: string; message: string; }

/** نمای اسنپ‌شات تراز آزمایشی و کنترل یکپارچگی مالی. */
export interface FinancialControlSnapshot { id: string; total_debits_rial: number; total_credits_rial: number; gateway_receivable_rial: number; benefactor_payable_rial: number; external_custody_rial: number; is_balanced: boolean; counter_drift_rial: number; created_at: string; }

/** گزارش کامل سلامت حلقهٔ وجه برای پنل عملیات. */
export interface FinancialHealth { status: FinancialHealthStatusEnum; generated_at: string; money_loop: MoneyLoopStats; recovery_ledger: Record<string, number>; refund_ledger: Record<string, number>; ops: OpsStats; alerts: Array<FinancialAlert>; money_truth?: MoneyTruthPanel; }

/** * `healthy` - healthy
* `attention_required` - attention_required */
export type FinancialHealthStatusEnum = "healthy" | "attention_required";

/** * `sandbox` - درگاه تعاملی آزمایشی (Sandbox)
* `zarinpal` - درگاه پرداخت زرین‌پال */
export type GatewayNameEnum = "sandbox" | "zarinpal";

/** پاسخ بررسی سلامت سامانه.

``status`` به‌جای رشتهٔ آزاد، مجموعهٔ بستهٔ سه‌حالته است: پایش‌گر
(Kubernetes probe، لودبالانسر، داشبورد) باید بتواند روی مقدار مقایسه
کند؛ رشتهٔ آزاد یعنی «شاید فردا چیز دیگری باشد». */
export interface HealthStatus { status: HealthStatusStatusEnum; checks?: Record<string, unknown>; }

/** * `healthy` - healthy
* `degraded` - degraded
* `unhealthy` - unhealthy */
export type HealthStatusStatusEnum = "healthy" | "degraded" | "unhealthy";

/** ورودی انتشار گزارش پیشرفت میدانی حرکت. */
export interface ImpactUpdateWriteRequest { milestone_type?: MilestoneTypeEnum; title: string; body: string; progress_percent: number; spent_amount_rial?: number; media_urls?: Array<string>; is_published?: boolean; }

/** * `scheduled` - زمان‌بندی‌شده و در انتظار سررسید
* `reminded` - سررسید شد و یادآوری ارسال شده
* `paid` - پرداخت‌شده
* `failed` - سررسید و مهلت گذشت بدون پرداخت
* `skipped` - از سوی خیر رد شد (این ماه پرداخت نمی‌کند)
* `expired` - منقضی بدون پرداخت پس از پایان تعهد
* `voided` - باطل‌شده (تعهد لغو یا مبلغ اصلاح شد) */
export type InstallmentStatusEnum = "scheduled" | "reminded" | "paid" | "failed" | "skipped" | "expired" | "voided";

/** نمای سند روزنامه. */
export interface JournalEntry { id: string; reference_key: string; kind: string; description: string; total_amount_rial: number; total_amount_toman: number; campaign_id: (string | null); benefactor_id: (string | null); created_at: string; created_at_jalali: (string | null); }

/** * `image` - تصویر
* `video` - ویدیو
* `document` - مستند تاییدیه */
export type KindEnum = "image" | "video" | "document";

/** ورودی اجرای دستی داوری پرداخت‌های رهاشده از پنل مدیریت. */
export interface LateCaptureReconcileInputRequest { batch_size?: number; dry_run?: boolean; }

/** خروجی آماری اجرای داوری پرداخت‌های رهاشده. */
export interface LateCaptureReconcileResult { scanned: number; not_captured: number; recovered: number; refund_pending: number; manual_review: number; error_count: number; dry_run: boolean; candidate_ids?: Array<string>; }

/** نمای سرفصل حساب در دفترکل. */
export interface LedgerAccount { id: string; code: string; title: string; account_type: string; benefactor_id: (string | null); debit_total_rial: number; credit_total_rial: number; balance_rial: number; balance_toman: number; }

/** نمای پاسخ علامت‌گذاری همگانی اعلان‌ها. */
export interface MarkAllReadResponse { marked_count: number; }

/** * `pending` - pending
* `matched` - matched
* `duplicate_in_file` - duplicate_in_file
* `missing_internal` - missing_internal
* `amount_mismatch` - amount_mismatch
* `internal_not_verified` - internal_not_verified
* `missing_gateway` - missing_gateway */
export type MatchStatusEnum = "pending" | "matched" | "duplicate_in_file" | "missing_internal" | "amount_mismatch" | "internal_not_verified" | "missing_gateway";

/** نمای عمومی حامی مضاعف‌کنندهٔ فعال روی حرکت. */
export interface MatchingGrantPublic { id: string; sponsor_name: string; sponsor_logo_url: string; match_ratio: number; total_pool_shares: number; consumed_shares: number; remaining_pool_shares: number; expires_at: (string | null); }

/** ورودی تعریف حامی مضاعف‌کننده روی حرکت. */
export interface MatchingGrantWriteRequest { sponsor_name: string; sponsor_logo_url?: string; match_ratio?: number; total_pool_shares: number; is_active?: boolean; expires_at?: (string | null); }

/** لنگر امضاشدهٔ ریشهٔ درخت مرکل منتشرشده برای یک حرکت. */
export interface MerkleAnchorOutput { merkle_root: string; leaf_count: number; signature_hmac: string; captured_at: string; captured_at_jalali: string; }

/** گواهی اثبات شمول یک مشارکت قطعی در درخت مرکل حرکت. */
export interface MerkleInclusionProofOutput { contribution_id: string; campaign_id: string; campaign_slug: string; leaf_index: number; total_leaves: number; leaf_hash: string; merkle_root: string; proof: Array<Record<string, unknown>>; verified: boolean; }

/** ورودی راستی‌آزمایی مستقل اثبات شمول درخت مرکل. */
export interface MerkleProofVerifyInputRequest { leaf_hash: string; merkle_root: string; proof: Array<Record<string, unknown>>; }

/** نتیجهٔ راستیآزمایی ریاضی مستقل اثبات شمول مرکل. */
export interface MerkleProofVerifyOutput { valid: boolean; }

/** ورودی کد ۶ رقمی TOTP یا کد بازیابی. */
export interface MfaCodeInputRequest { code: string; }

/** خروجی تأیید نهایی TOTP شامل ۱۰ کد بازیابی یک‌بارمصرف. */
export interface MfaConfirmOutput { enrolled: boolean; recovery_codes: Array<string>; }

/** خروجی مرحلهٔ راه‌اندازی TOTP شامل QR برداری. */
export interface MfaSetupOutput { secret: string; otpauth_uri: string; qr_svg: string; }

/** وضعیت عامل دوم کارمند. */
export interface MfaStatusOutput { enrolled: boolean; session_verified: boolean; verified_at: (string | null); remaining_recovery_codes: number; }

/** * `funding_complete` - تکمیل جذب منابع
* `disbursed` - واریز وجه به خیریه مجری
* `procurement` - تهیه اقلام / شروع عملیات
* `field_delivery` - تحویل و اجرای میدانی
* `final_report` - گزارش پایانی و مستندات تکمیل */
export type MilestoneTypeEnum = "funding_complete" | "disbursed" | "procurement" | "field_delivery" | "final_report";

/** آمار اصلی حلقهٔ وجه: پرداخت‌های رهاشده، تعهدهای بازپرداخت و بدهی ریالی. */
export interface MoneyLoopStats { abandoned_payments: number; abandoned_amount_rial: number; stale_abandoned_over_1h: number; unresolved_late_captures: number; awaiting_refund_contributions: number; awaiting_refund_amount_rial: number; pending_refund_obligations: number; refund_liability_rial: number; manual_refunds_due: number; manual_refund_amount_rial: number; orphan_refund_obligations: number; }

/** پنل «حقیقت وجه» — تنها عددی که می‌توان به هیئت‌مدیره گفت. */
export interface MoneyTruthPanel { verified_but_unconfirmed: number; statement_confirmed: number; statement_missing: number; conflict: number; last_statement_at: (string | null); statement_age_hours: (number | null); unresolved_findings: number; unresolved_impact_rial: number; statements_total: number; rows_pending_verdict: number; }

/** یک نشان افتخار (قفل/باز) در کارنامهٔ معنوی خیر. */
export interface MotivationBadgeOutput { code: string; title: string; description: string; earned: boolean; current: number; target: number; }

/** شمارنده‌های عملیاتی مرتبط (صندوق خروجی متوقف‌شده). */
export interface OpsStats { dead_outbox_messages: number; }

/** پاسخ یکسان ضد شمارش کاربر هنگام درخواست OTP. */
export interface OtpRequestAccepted { status: string; ttl_seconds: number; message: string; }

/** ورودی درخواست ارسال کد یک‌بارمصرف پیامکی. */
export interface OtpRequestInputRequest { phone: string; }

/** ورودی تأیید کد ۵ رقمی پیامکی. */
export interface OtpVerifyInputRequest { phone: string; code: string; }

/** PaginatedAdminUser */
export interface PaginatedAdminUser { results: Array<AdminUserOutput>; meta: PaginatedAdminUserMeta; }

/** PaginatedAdminUserMeta */
export interface PaginatedAdminUserMeta { next: (string | null); previous: (string | null); page_size: number; }

/** PaginatedAuditRecord */
export interface PaginatedAuditRecord { results: Array<AuditRecord>; meta: PaginatedAuditRecordMeta; }

/** PaginatedAuditRecordMeta */
export interface PaginatedAuditRecordMeta { next: (string | null); previous: (string | null); page_size: number; }

/** PaginatedAuthRiskSignal */
export interface PaginatedAuthRiskSignal { results: Array<AuthRiskSignalOutput>; meta: PaginatedAuthRiskSignalMeta; }

/** PaginatedAuthRiskSignalMeta */
export interface PaginatedAuthRiskSignalMeta { next: (string | null); previous: (string | null); page_size: number; }

/** PaginatedContributionUser */
export interface PaginatedContributionUser { results: Array<ContributionUser>; meta: PaginatedContributionUserMeta; }

/** PaginatedContributionUserMeta */
export interface PaginatedContributionUserMeta { next: (string | null); previous: (string | null); page_size: number; total: number; }

/** PaginatedUserNotification */
export interface PaginatedUserNotification { results: Array<UserNotification>; meta: PaginatedUserNotificationMeta; }

/** PaginatedUserNotificationMeta */
export interface PaginatedUserNotificationMeta { next: (string | null); previous: (string | null); page_size: number; total: number; }

/** ورودی ویرایش جزئی خیریه. */
export interface PatchedBenefactorPatchRequest { name?: string; slug?: string; registration_number?: string; national_identifier?: string; province?: string; city?: string; short_bio?: string; description?: string; logo_url?: string; cover_url?: string; website_url?: string; contact_phone?: string; iban?: string; bank_holder_name?: string; is_verified?: boolean; is_active?: boolean; display_order?: number; }

/** ورودی ویرایش جزئی حرکت توسط مدیر. */
export interface PatchedCampaignPatchRequest { benefactor_id?: string; category_id?: (string | null); title?: string; slug?: string; subtitle?: string; why_and_what?: string; cover_image_url?: string; video_url?: string; province?: string; city?: string; total_shares?: number; share_price_rial?: number; min_shares_per_order?: number; max_shares_per_order?: number; status?: CampaignStatusEnum; urgency_level?: CampaignUrgencyEnum; is_featured?: boolean; allow_anonymous?: boolean; allow_dedication?: boolean; starts_at?: (string | null); ends_at?: (string | null); reason?: string; }

/** ورودی ویرایش جزئی قلک عام خیریه. */
export interface PatchedCharityJarPatchRequest { title?: string; description?: string; suggested_amounts_rial?: Array<number>; min_amount_rial?: number; max_amount_rial?: number; monthly_goal_rial?: number; is_active?: boolean; }

/** ورودی ویرایش تعهد: مبلغ، تناوب، روز شروع یا توقف موقت. */
export interface PatchedPledgeUpdateInputRequest { amount_rial?: number; frequency?: PledgeFrequencyEnum; start_day?: number; pause_until?: (string | null); }

/** ورودی ویرایش مشخصات پروفایل خیر. */
export interface PatchedProfileUpdateInputRequest { first_name?: string; last_name?: string; national_code?: string; province?: string; city?: string; }

/** ورودی تأیید بازگشت از درگاه پرداخت. */
export interface PaymentCallbackVerifyInputRequest { authority: string; status?: string; }

/** ورودی استرداد پرداخت تاییدشده توسط مدیر مالی (Step-Up MFA). */
export interface PaymentRefundInputRequest { reason: string; bank_reference?: string; }

/** * `initiated` - هدایت‌شده به درگاه
* `verified` - تأیید نهایی شاپرک/درگاه
* `failed` - ناموفق یا انصراف تأییدشدهٔ کاربر در درگاه
* `abandoned` - رها‌شده: رزرو منقضی شد و وضعیت پول نامعلوم است
* `refunded` - مستردشده */
export type PaymentStatusEnum = "initiated" | "verified" | "failed" | "abandoned" | "refunded";

/** پاسخ تأیید تراکنش درگاه پرداخت. */
export interface PaymentVerifyResponse { verified: boolean; payment_status: string; contribution_id: string; ref_id: string; shares_count: number; matched_shares_awarded: number; amount_rial: number; amount_toman: number; receipt_number: (string | null); verification_code: (string | null); dedication_token: (string | null); }

/** پاسخ نقطهٔ پایانی ``GET /api/v1/meta`` برای بوت‌استرپ فرانت‌اند. */
export interface PlatformMeta { service: string; environment: string; api_version: string; app_version: string; supported_versions: Array<string>; currency_base: string; currency_display_units: Array<string>; timezone: string; today_jalali: string; features: { anonymous_and_live_feed: boolean; charity_general_jars: boolean; express_one_step_checkout: boolean; external_offline_funding: boolean; impact_updates: boolean; matching_grants: boolean; merkle_transparency: boolean; shortlinks_and_ambassadors: boolean; spiritual_dedications: boolean; }; share_hold_ttl_minutes: number; }

/** ورودی لغو یا رد قسط. */
export interface PledgeCancelInputRequest { reason?: string; }

/** ورودی ساخت تعهد کمک مستمر. */
export interface PledgeCreateInputRequest { target_kind: ContributionTargetKindEnum; campaign_id?: (string | null); charity_jar_id?: (string | null); amount_rial: number; frequency?: PledgeFrequencyEnum; shares_count?: number; start_day?: (number | null); duration_months?: (number | null); }

/** نتیجهٔ یک اجرای دستی چرخهٔ تعهد مستمر. */
export interface PledgeCycleOutput { materialize: Record<string, unknown>; reminders: Record<string, unknown>; expiry: Record<string, unknown>; resumed: number; }

/** * `monthly` - ماهانه
* `quarterly` - سه‌ماهه */
export type PledgeFrequencyEnum = "monthly" | "quarterly";

/** یک قسط تعهد مستمر — با وضعیت خوانا و مبلغ به تومان.

``status`` و ``frequency`` به‌جای ``CharField`` آزاد، ``ChoiceField``
تایپ‌شده‌اند. چرا؟ چون فرانت باید بتواند به‌جای مقایسهٔ رشته‌ای شکننده
(``if (s.status === "paid")``) از union type تولیدشده استفاده کند، و
مستندات Swagger باید فهرست دقیق مقادیر مجاز را نشان دهد. رشتهٔ آزاد در
قرارداد یعنی «هر چیزی ممکن است» — که برای ماشین حالت فرانت بی‌فایده است. */
export interface PledgeInstallmentOutput { id: string; sequence: number; due_date: string; grace_until: string; amount_rial: number; amount_toman: number; status: InstallmentStatusEnum; status_display: string; is_open: boolean; reminder_count: number; failure_reason: string; can_pay: boolean; can_skip: boolean; contribution_id: (string | null); }

/** تعهد مستمر با خلاصهٔ اقساط و وضعیت قابل‌اقدام. */
export interface PledgeOutput { id: string; status: PledgeStatusEnum; status_display: string; target_kind: ContributionTargetKindEnum; target_title: string; amount_rial: number; amount_toman: number; frequency: PledgeFrequencyEnum; frequency_display: string; interval_months: number; anchor_day: number; next_due_date: string; total_paid_rial: number; total_paid_toman: number; installments_paid: number; installments_skipped: number; duration_months: (number | null); installments_remaining: (number | null); progress_percent: (number | null); consecutive_failures: number; pause_until: (string | null); created_at: string; open_installments: number; next_payable_installment_id: (string | null); }

/** ورودی آغاز پرداخت یک قسط. */
export interface PledgePayInputRequest { installment_id: string; gateway_name?: string; }

/** نتیجهٔ آغاز پرداخت قسط: شناسهٔ پرداخت و لینک درگاه. */
export interface PledgePayOutput { installment_id: string; contribution_id: string; payment_id: string; amount_rial: number; amount_toman: number; redirect_url: string; }

/** آمار تجمیعی تعهدهای مستمر — مبنای بودجه‌بندی خیریه. */
export interface PledgeStatsOutput { active_pledges: number; paused_pledges: number; expired_pledges: number; cancelled_pledges: number; monthly_recurring_revenue_rial: number; monthly_recurring_revenue_toman: number; active_pledge_amount_rial: number; collection_rate: number; paid_installments_window: number; failed_installments_window: number; churn_window: number; churn_rate: number; average_pledge_lifetime_months: number; top_failure_reasons: Array<Record<string, unknown>>; generated_for_window_days: number; }

/** * `active` - فعال — قسط بعدی ساخته می‌شود
* `paused` - موقتاً متوقف به خواست خیر
* `expired` - منقضی پس از شکست‌های متوالی پرداخت
* `cancelled` - لغو‌شده به خواست خیر
* `completed` - به پایان رسیده (تعداد قسط تکمیل شد) */
export type PledgeStatusEnum = "active" | "paused" | "expired" | "cancelled" | "completed";

/** نمای خروجی یک قانون سیاست سامانه برای پنل مدیریت. */
export interface PolicyRuleOutput { key: string; value_type: string; value: unknown; "default": unknown; description: string; version: number; }

/** ورودی تغییر مقدار یک سیاست همراه با دلیل اجباری ممیزی. */
export interface PolicyUpdateInputRequest { value: unknown; reason: string; }

/** استعلام عمومی اصالت رسید رسمی مشارکت (بدون افشای شماره موبایل خیر). */
export interface ReceiptVerificationOutput { valid: boolean; status: string; receipt_number: string; verification_code: string; signature_hmac: string; donor_display_name: string; benefactor_name: string; target_kind: string; target_title: string; shares_count: number; matched_shares_awarded: number; amount_rial: number; amount_toman: number; paid_at: (string | null); paid_at_jalali: string; }

/** بدنهٔ اجرای تطبیق/اقدام روی یک صورت‌حساب.

پیش‌فرض ``dry_run=True`` عمدی است: این عملیات وضعیت حقیقت صدها پرداخت را
تغییر می‌دهد و پیش‌فرض باید بی‌خطر باشد. اپراتور باید صریحاً بگوید «اجرا کن». */
export interface ReconcileInputRequest { dry_run?: boolean; }

/** نمای خروجی دستهٔ مغایرت‌گیری به همراه مغایرت‌ها. */
export interface ReconciliationBatch { id: string; gateway_name: string; period_start: string; period_end: string; gateway_reported_count: number; matched_count: number; discrepancy_count: number; gateway_total_rial: number; internal_total_rial: number; items: Array<ReconciliationItem>; created_at: string; }

/** نمای ردیف نتیجهٔ مغایرت‌گیری. */
export interface ReconciliationItem { authority: string; ref_id: string; gateway_amount_rial: number; internal_amount_rial: number; status: ReconciliationItemStatusEnum; note: string; }

/** * `matched` - منطبق
* `amount_mismatch` - مغایرت مبلغ ریالی
* `missing_internal` - موجود در درگاه / فاقد پرداخت موفق داخلی
* `missing_gateway` - پرداخت موفق داخلی / غایب در فایل تسویه درگاه */
export type ReconciliationItemStatusEnum = "matched" | "amount_mismatch" | "missing_internal" | "missing_gateway";

/** یک ردیف از فایل تسویه درگاه پرداخت. */
export interface ReconciliationRowInputRequest { authority: string; ref_id?: string; amount_rial: number; }

/** ورودی اجرای مغایرت‌گیری درگاه پرداخت. */
export interface ReconciliationRunInputRequest { gateway_name?: string; period_start: string; period_end: string; rows: Array<ReconciliationRowInputRequest>; }

/** آمار خام یک اجرای تطبیق (هم برای dry_run و هم اجرای واقعی). */
export interface ReconciliationStats { matched: number; amount_mismatch: number; missing_internal: number; missing_gateway: number; internal_not_verified: number; duplicate_in_file: number; financial_impact_rial: number; }

/** خروجی آماری ارسال تعهدهای بازپرداخت به درگاه. */
export interface RefundDispatchResult { attempted: number; sent: number; manual: number; failed: number; skipped: number; over_cap: number; }

/** نتیجهٔ استرداد وجه همراه با سند معکوس دفترکل. */
export interface RefundResultOutput { refund_id: string; amount_rial: number; status: string; }

/** نتیجهٔ اجرای مرحلهٔ اقدام روی یک صورت‌حساب. */
export interface RemediationOutcome { statement_id: string; auto_healed: number; queued_review: number; blocked: number; skipped: number; already_resolved: number; heal_details: Array<Record<string, unknown>>; }

/** نمای تاریخچهٔ خروجی‌های اکسل صادرشده. */
export interface ReportExportLog { id: string; exported_by_id: string; filters: unknown; include_raw_phones: boolean; reason: string; file_sha256: string; byte_size: number; row_counts: unknown; created_at: string; }

/** * `open` - باز
* `reviewed` - بررسی‌شده
* `dismissed` - بی‌خطر تشخیص داده‌شده */
export type RiskReviewStatusEnum = "open" | "reviewed" | "dismissed";

/** * `donor` - نیکوکار (کاربر عادی)
* `operator` - کارشناس عملیات
* `finance_manager` - مدیر مالی و ممیزی
* `super_admin` - مدیر ارشد سامانه */
export type RoleEnum = "donor" | "operator" | "finance_manager" | "super_admin";

/** اطلاعات تراکنش درگاه تعاملی Sandbox جهت رندر شبیهساز پرداخت. */
export interface SandboxPaymentOutput { authority: string; amount_rial: number; amount_toman: number; status: string; }

/** نمای یک نشست فعال در فهرست دستگاه‌های کاربر. */
export interface SessionItemOutput { id: string; device: string; network: string; mfa_verified: boolean; created_at: string; last_seen_at: string; is_current: boolean; }

/** بدنهٔ ورود یک صورت‌حساب تسویهٔ درگاه. */
export interface SettlementIngestRequest { gateway_name: GatewayNameEnum; source_kind?: SettlementIngestSourceKindEnum; period_start: string; period_end: string; declared_total_rial?: (number | null); original_filename?: string; rows: Array<SettlementRowInputRequest>; }

/** * `csv` - CSV
* `xlsx` - اکسل
* `api` - API
* `manual` - دستی */
export type SettlementIngestSourceKindEnum = "csv" | "xlsx" | "api" | "manual";

/** SettlementList */
export interface SettlementList { results: Array<SettlementStatement>; meta: SettlementListMeta; }

/** SettlementListMeta */
export interface SettlementListMeta { next: (string | null); previous: (string | null); page_size: number; }

/** نمای یک ردیف صورت‌حساب و نتیجهٔ تطبیق آن. */
export interface SettlementRow { id: string; row_number: number; authority: string; ref_id: string; amount_rial: number; occurred_at: (string | null); match_status: MatchStatusEnum; match_note: string; payment_id: (string | null); remediation: string; remediation_note: string; }

/** یک ردیف ورودی صورت‌حساب (ورود از API به‌جای فایل). */
export interface SettlementRowInputRequest { authority: string; amount_rial?: string; ref_id?: string; occurred_at?: string; card_pan_masked?: string; description?: string; }

/** نمای یک سند صورت‌حساب تسویه. */
export interface SettlementStatement { id: string; gateway_name: SettlementStatementGatewayNameEnum; source_kind: SettlementStatementSourceKindEnum; status: SettlementStatementStatusEnum; original_filename: string; period_start: string; period_end: string; row_count: number; declared_total_rial: number; computed_total_rial: number; integrity_ok: boolean; integrity_note: string; statement_sha256: string; created_at: string; }

/** * `sandbox` - sandbox
* `zarinpal` - zarinpal
* `idpay` - idpay
* `nextpay` - nextpay
* `manual` - manual */
export type SettlementStatementGatewayNameEnum = "sandbox" | "zarinpal" | "idpay" | "nextpay" | "manual";

/** * `csv` - csv
* `xlsx` - xlsx
* `api` - api
* `manual` - manual */
export type SettlementStatementSourceKindEnum = "csv" | "xlsx" | "api" | "manual";

/** * `received` - received
* `parsed` - parsed
* `reconciling` - reconciling
* `reconciled` - reconciled
* `failed` - failed */
export type SettlementStatementStatusEnum = "received" | "parsed" | "reconciling" | "reconciled" | "failed";

/** * `critical` - critical
* `warning` - warning
* `info` - info */
export type SeverityEnum = "critical" | "warning" | "info";

/** تفکیک سهام حرکت به آنلاین، مضاعفشده، آفلاین، رزروشده و باقیمانده. */
export interface SharesBreakdownOutput { total_shares: number; paid_online_shares: number; matched_sponsor_shares: number; external_offline_shares: number; reserved_shares: number; remaining_shares: number; }

/** پاسخ حل‌کنندهٔ پیوندک کوتاه. */
export interface ShortLinkResolveResponse { kind: string; short_code: string; slug: string; title: string; target_path: string; ambassador_code?: (string | null); }

/** ورودی ورود کارکنان با گذرواژه. */
export interface StaffPasswordLoginInputRequest { phone: string; password: string; }

/** ورودی نوسازی چرخشی توکن دسترسی. */
export interface TokenRefreshInputRequest { refresh_token: string; }

/** نمای پروفایل کاربر جاری. */
export interface UserMeOutput { id: string; phone: string; first_name: string; last_name: string; display_name: string; national_code_masked: string; province: string; city: string; role: RoleEnum; is_profile_complete: boolean; is_staff_member: boolean; created_at: string; created_at_jalali: (string | null); }

/** نمای خروجی یک اعلان کاربر. */
export interface UserNotification { id: string; kind: string; title: string; body: string; action_url: string; metadata: unknown; is_read: boolean; read_at: (string | null); created_at: string; created_at_jalali: (string | null); }

export type ApiOperationId =
  | "v1_admin_audit_logs_list"
  | "v1_admin_audit_verify"
  | "v1_admin_benefactors_list"
  | "v1_admin_benefactors_create"
  | "v1_admin_benefactors_destroy"
  | "v1_admin_benefactors_retrieve"
  | "v1_admin_benefactors_partial_update"
  | "v1_admin_jars_list"
  | "v1_admin_jars_create"
  | "v1_admin_jars_partial_update"
  | "v1_admin_campaign_categories_create"
  | "v1_admin_campaigns_list"
  | "v1_admin_campaigns_create"
  | "v1_admin_campaigns_retrieve"
  | "v1_admin_campaigns_partial_update"
  | "v1_admin_campaigns_impact_updates_create"
  | "v1_admin_campaigns_matching_grants_create"
  | "v1_admin_reports_excel_export"
  | "v1_admin_reports_export_history_list"
  | "v1_admin_policies_list"
  | "v1_admin_policies_update"
  | "v1_admin_auth_risks_list"
  | "v1_admin_auth_risks_review"
  | "v1_admin_users_list"
  | "v1_admin_users_reveal_phone"
  | "v1_admin_users_role_update"
  | "v1_admin_disbursements_list"
  | "v1_admin_disbursements_create"
  | "v1_admin_disbursements_review"
  | "v1_admin_ledger_accounts_list"
  | "v1_admin_ledger_control_snapshot_create"
  | "v1_admin_ledger_entries_list"
  | "v1_admin_reconciliations_list"
  | "v1_admin_reconciliations_create"
  | "v1_admin_money_truth_retrieve"
  | "v1_admin_settlements_list"
  | "v1_admin_settlements_create"
  | "v1_admin_settlements_retrieve"
  | "v1_admin_settlements_reconcile"
  | "v1_admin_settlements_remediate"
  | "v1_admin_settlements_rows_list"
  | "v1_admin_campaigns_external_contributions_create"
  | "v1_admin_payments_list"
  | "v1_admin_payments_refund"
  | "v1_admin_pledges_list"
  | "v1_admin_pledges_run_cycle"
  | "v1_admin_pledges_stats"
  | "v1_admin_financial_health_retrieve"
  | "v1_admin_late_captures_reconcile"
  | "v1_admin_refunds_dispatch"
  | "v1_health_detailed"
  | "v1_auth_logout"
  | "v1_auth_logout_others"
  | "v1_auth_otp_request"
  | "v1_auth_otp_verify"
  | "v1_auth_staff_password_login"
  | "v1_auth_token_refresh"
  | "v1_auth_mfa_status"
  | "v1_auth_mfa_totp_confirm"
  | "v1_auth_mfa_totp_setup"
  | "v1_auth_mfa_verify"
  | "v1_contributions_checkout_create"
  | "v1_me_contributions_list"
  | "v1_me_dashboard_retrieve"
  | "v1_me_notifications_list"
  | "v1_me_notifications_read_all"
  | "v1_me_notifications_read"
  | "v1_me_profile_retrieve"
  | "v1_me_profile_update"
  | "v1_me_sessions_list"
  | "v1_me_sessions_revoke"
  | "v1_me_pledges_list"
  | "v1_me_pledges_create"
  | "v1_me_pledges_destroy"
  | "v1_me_pledges_retrieve"
  | "v1_me_pledges_update"
  | "v1_me_pledges_installments_list"
  | "v1_me_pledges_skip_installment"
  | "v1_me_pledges_pay"
  | "v1_benefactors_list"
  | "v1_benefactors_retrieve"
  | "v1_jars_list"
  | "v1_jars_retrieve"
  | "v1_campaign_categories_list"
  | "v1_campaigns_list"
  | "v1_campaigns_retrieve"
  | "v1_campaigns_supporters_list"
  | "v1_campaigns_transparency_retrieve"
  | "v1_me_contributions_merkle_proof_retrieve"
  | "v1_transparency_verify_merkle_proof"
  | "v1_dedications_retrieve"
  | "v1_contributions_express_confirm"
  | "v1_contributions_express_start"
  | "v1_payments_callback_get"
  | "v1_payments_verify_post"
  | "v1_payments_sandbox_retrieve"
  | "v1_receipts_verify_retrieve"
  | "v1_me_ambassador_links_list"
  | "v1_me_ambassador_links_create"
  | "v1_short_links_resolve"
  | "v1_csrf_bootstrap"
  | "v1_health_live"
  | "v1_health_ready"
  | "v1_meta_retrieve";

export interface ApiOperationMap {
  "v1_admin_audit_logs_list": { request: never; response: PaginatedAuditRecord; auth: "required" };
  "v1_admin_audit_verify": { request: never; response: AuditChainVerification; auth: "required" };
  "v1_admin_benefactors_list": { request: never; response: Array<BenefactorAdmin>; auth: "required" };
  "v1_admin_benefactors_create": { request: BenefactorWriteRequest; response: BenefactorAdmin; auth: "required" };
  "v1_admin_benefactors_destroy": { request: never; response: { deleted?: boolean; deactivated?: boolean; id?: string; }; auth: "required" };
  "v1_admin_benefactors_retrieve": { request: never; response: BenefactorAdmin; auth: "required" };
  "v1_admin_benefactors_partial_update": { request: PatchedBenefactorPatchRequest; response: BenefactorAdmin; auth: "required" };
  "v1_admin_jars_list": { request: never; response: Array<CharityJarPublic>; auth: "required" };
  "v1_admin_jars_create": { request: CharityJarWriteRequest; response: CharityJarPublic; auth: "required" };
  "v1_admin_jars_partial_update": { request: PatchedCharityJarPatchRequest; response: CharityJarPublic; auth: "required" };
  "v1_admin_campaign_categories_create": { request: CampaignCategoryWriteRequest; response: CampaignCategory; auth: "required" };
  "v1_admin_campaigns_list": { request: never; response: Array<CampaignDetail>; auth: "required" };
  "v1_admin_campaigns_create": { request: CampaignWriteRequest; response: CampaignDetail; auth: "required" };
  "v1_admin_campaigns_retrieve": { request: never; response: CampaignDetail; auth: "required" };
  "v1_admin_campaigns_partial_update": { request: PatchedCampaignPatchRequest; response: CampaignDetail; auth: "required" };
  "v1_admin_campaigns_impact_updates_create": { request: ImpactUpdateWriteRequest; response: CampaignImpactUpdate; auth: "required" };
  "v1_admin_campaigns_matching_grants_create": { request: MatchingGrantWriteRequest; response: MatchingGrantPublic; auth: "required" };
  "v1_admin_reports_excel_export": { request: never; response: Blob; auth: "required" };
  "v1_admin_reports_export_history_list": { request: never; response: Array<ReportExportLog>; auth: "required" };
  "v1_admin_policies_list": { request: never; response: Array<PolicyRuleOutput>; auth: "required" };
  "v1_admin_policies_update": { request: PolicyUpdateInputRequest; response: PolicyRuleOutput; auth: "required" };
  "v1_admin_auth_risks_list": { request: never; response: PaginatedAuthRiskSignal; auth: "required" };
  "v1_admin_auth_risks_review": { request: AuthRiskReviewInputRequest; response: AuthRiskSignalOutput; auth: "required" };
  "v1_admin_users_list": { request: never; response: PaginatedAdminUser; auth: "required" };
  "v1_admin_users_reveal_phone": { request: AdminPhoneRevealInputRequest; response: { phone: string; }; auth: "required" };
  "v1_admin_users_role_update": { request: AdminRoleChangeInputRequest; response: AdminUserOutput; auth: "required" };
  "v1_admin_disbursements_list": { request: never; response: Array<DisbursementRequest>; auth: "required" };
  "v1_admin_disbursements_create": { request: DisbursementCreateInputRequest; response: DisbursementRequest; auth: "required" };
  "v1_admin_disbursements_review": { request: DisbursementReviewInputRequest; response: DisbursementRequest; auth: "required" };
  "v1_admin_ledger_accounts_list": { request: never; response: Array<LedgerAccount>; auth: "required" };
  "v1_admin_ledger_control_snapshot_create": { request: never; response: FinancialControlSnapshot; auth: "required" };
  "v1_admin_ledger_entries_list": { request: never; response: Array<JournalEntry>; auth: "required" };
  "v1_admin_reconciliations_list": { request: never; response: Array<ReconciliationBatch>; auth: "required" };
  "v1_admin_reconciliations_create": { request: ReconciliationRunInputRequest; response: ReconciliationBatch; auth: "required" };
  "v1_admin_money_truth_retrieve": { request: never; response: MoneyTruthPanel; auth: "required" };
  "v1_admin_settlements_list": { request: never; response: SettlementList; auth: "required" };
  "v1_admin_settlements_create": { request: SettlementIngestRequest; response: SettlementStatement; auth: "required" };
  "v1_admin_settlements_retrieve": { request: never; response: SettlementStatement; auth: "required" };
  "v1_admin_settlements_reconcile": { request: ReconcileInputRequest; response: ReconciliationStats; auth: "required" };
  "v1_admin_settlements_remediate": { request: ReconcileInputRequest; response: RemediationOutcome; auth: "required" };
  "v1_admin_settlements_rows_list": { request: never; response: Array<SettlementRow>; auth: "required" };
  "v1_admin_campaigns_external_contributions_create": { request: ExternalContributionWriteRequest; response: ExternalContribution; auth: "required" };
  "v1_admin_payments_list": { request: never; response: Array<AdminPayment>; auth: "required" };
  "v1_admin_payments_refund": { request: PaymentRefundInputRequest; response: RefundResultOutput; auth: "required" };
  "v1_admin_pledges_list": { request: never; response: Array<AdminPledge>; auth: "required" };
  "v1_admin_pledges_run_cycle": { request: never; response: PledgeCycleOutput; auth: "required" };
  "v1_admin_pledges_stats": { request: never; response: PledgeStatsOutput; auth: "required" };
  "v1_admin_financial_health_retrieve": { request: never; response: FinancialHealth; auth: "required" };
  "v1_admin_late_captures_reconcile": { request: LateCaptureReconcileInputRequest; response: LateCaptureReconcileResult; auth: "required" };
  "v1_admin_refunds_dispatch": { request: never; response: RefundDispatchResult; auth: "required" };
  "v1_health_detailed": { request: never; response: HealthStatus; auth: "required" };
  "v1_auth_logout": { request: never; response: void; auth: "required" };
  "v1_auth_logout_others": { request: never; response: { revoked_count: number; }; auth: "required" };
  "v1_auth_otp_request": { request: OtpRequestInputRequest; response: OtpRequestAccepted; auth: "optional" };
  "v1_auth_otp_verify": { request: OtpVerifyInputRequest; response: AuthTokensOutput; auth: "optional" };
  "v1_auth_staff_password_login": { request: StaffPasswordLoginInputRequest; response: AuthTokensOutput; auth: "optional" };
  "v1_auth_token_refresh": { request: TokenRefreshInputRequest; response: AuthTokensOutput; auth: "optional" };
  "v1_auth_mfa_status": { request: never; response: MfaStatusOutput; auth: "required" };
  "v1_auth_mfa_totp_confirm": { request: MfaCodeInputRequest; response: MfaConfirmOutput; auth: "required" };
  "v1_auth_mfa_totp_setup": { request: never; response: MfaSetupOutput; auth: "required" };
  "v1_auth_mfa_verify": { request: MfaCodeInputRequest; response: MfaStatusOutput; auth: "required" };
  "v1_contributions_checkout_create": { request: CheckoutInitiateInputRequest; response: CheckoutInitiateResponse; auth: "required" };
  "v1_me_contributions_list": { request: never; response: PaginatedContributionUser; auth: "required" };
  "v1_me_dashboard_retrieve": { request: never; response: DonorDashboardOutput; auth: "required" };
  "v1_me_notifications_list": { request: never; response: PaginatedUserNotification; auth: "required" };
  "v1_me_notifications_read_all": { request: never; response: MarkAllReadResponse; auth: "required" };
  "v1_me_notifications_read": { request: never; response: UserNotification; auth: "required" };
  "v1_me_profile_retrieve": { request: never; response: UserMeOutput; auth: "required" };
  "v1_me_profile_update": { request: PatchedProfileUpdateInputRequest; response: UserMeOutput; auth: "required" };
  "v1_me_sessions_list": { request: never; response: Array<SessionItemOutput>; auth: "required" };
  "v1_me_sessions_revoke": { request: never; response: void; auth: "required" };
  "v1_me_pledges_list": { request: never; response: Array<PledgeOutput>; auth: "required" };
  "v1_me_pledges_create": { request: PledgeCreateInputRequest; response: PledgeOutput; auth: "required" };
  "v1_me_pledges_destroy": { request: never; response: PledgeOutput; auth: "required" };
  "v1_me_pledges_retrieve": { request: never; response: PledgeOutput; auth: "required" };
  "v1_me_pledges_update": { request: PatchedPledgeUpdateInputRequest; response: PledgeOutput; auth: "required" };
  "v1_me_pledges_installments_list": { request: never; response: Array<PledgeInstallmentOutput>; auth: "required" };
  "v1_me_pledges_skip_installment": { request: PledgeCancelInputRequest; response: PledgeInstallmentOutput; auth: "required" };
  "v1_me_pledges_pay": { request: PledgePayInputRequest; response: PledgePayOutput; auth: "required" };
  "v1_benefactors_list": { request: never; response: Array<BenefactorPublic>; auth: "none" };
  "v1_benefactors_retrieve": { request: never; response: BenefactorPublic; auth: "none" };
  "v1_jars_list": { request: never; response: Array<CharityJarPublic>; auth: "none" };
  "v1_jars_retrieve": { request: never; response: CharityJarPublic; auth: "none" };
  "v1_campaign_categories_list": { request: never; response: Array<CampaignCategory>; auth: "none" };
  "v1_campaigns_list": { request: never; response: CampaignList; auth: "none" };
  "v1_campaigns_retrieve": { request: never; response: CampaignDetail; auth: "none" };
  "v1_campaigns_supporters_list": { request: never; response: Array<CampaignSupporterOutput>; auth: "none" };
  "v1_campaigns_transparency_retrieve": { request: never; response: CampaignTransparencyOutput; auth: "none" };
  "v1_me_contributions_merkle_proof_retrieve": { request: never; response: MerkleInclusionProofOutput; auth: "required" };
  "v1_transparency_verify_merkle_proof": { request: MerkleProofVerifyInputRequest; response: MerkleProofVerifyOutput; auth: "none" };
  "v1_dedications_retrieve": { request: never; response: DedicationCertificateOutput; auth: "none" };
  "v1_contributions_express_confirm": { request: ExpressConfirmInputRequest; response: CheckoutInitiateResponse; auth: "none" };
  "v1_contributions_express_start": { request: ExpressStartInputRequest; response: ExpressStartResponse; auth: "none" };
  "v1_payments_callback_get": { request: never; response: PaymentVerifyResponse; auth: "none" };
  "v1_payments_verify_post": { request: PaymentCallbackVerifyInputRequest; response: PaymentVerifyResponse; auth: "none" };
  "v1_payments_sandbox_retrieve": { request: never; response: SandboxPaymentOutput; auth: "none" };
  "v1_receipts_verify_retrieve": { request: never; response: ReceiptVerificationOutput; auth: "none" };
  "v1_me_ambassador_links_list": { request: never; response: Array<AmbassadorLink>; auth: "required" };
  "v1_me_ambassador_links_create": { request: AmbassadorCreateInputRequest; response: AmbassadorLink; auth: "required" };
  "v1_short_links_resolve": { request: never; response: ShortLinkResolveResponse; auth: "none" };
  "v1_csrf_bootstrap": { request: never; response: { csrf_token: string; }; auth: "optional" };
  "v1_health_live": { request: never; response: HealthStatus; auth: "optional" };
  "v1_health_ready": { request: never; response: HealthStatus; auth: "optional" };
  "v1_meta_retrieve": { request: never; response: PlatformMeta; auth: "optional" };
}

export type ApiOperation<K extends ApiOperationId> = ApiOperationMap[K];
