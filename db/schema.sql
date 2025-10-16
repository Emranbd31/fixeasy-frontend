CREATE TABLE terms (
    id SERIAL PRIMARY KEY,
    version TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    archived BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
    terms_version TEXT NOT NULL,
    terms_accepted_at TIMESTAMPTZ NOT NULL,
    accepted_ip TEXT,
    user_agent TEXT,
    oauth_provider TEXT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    eircode TEXT,
    location JSONB,
    saved_payment_method JSONB
);

CREATE TABLE professionals (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    pps_number TEXT NOT NULL,
    categories TEXT[] NOT NULL,
    service_area TEXT NOT NULL,
    availability JSONB,
    kyc_status TEXT NOT NULL DEFAULT 'pending',
    stripe_account_id TEXT,
    bank_account_id TEXT,
    documents JSONB NOT NULL DEFAULT '[]'::JSONB
);

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    before_state JSONB,
    after_state JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies
CREATE POLICY client_self ON profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY professional_self ON professionals FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY admin_full_access ON audit_logs FOR ALL
    USING (auth.role() = 'service_role');
