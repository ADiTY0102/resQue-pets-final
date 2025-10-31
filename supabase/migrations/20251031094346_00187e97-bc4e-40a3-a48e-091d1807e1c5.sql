-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('user', 'admin');

-- Create users_profile table
CREATE TABLE public.users_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(15),
    email VARCHAR(120) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);

-- Create pets table
CREATE TABLE public.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.users_profile (id) ON DELETE SET NULL,
    name VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    disease_reason TEXT,
    age INTEGER,
    type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'adopted')),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create donation_requests table
CREATE TABLE public.donation_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users_profile (id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES public.pets (id) ON DELETE CASCADE NOT NULL,
    request_status VARCHAR(20) DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create adoption_requests table
CREATE TABLE public.adoption_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users_profile (id) ON DELETE CASCADE NOT NULL,
    pet_id UUID REFERENCES public.pets (id) ON DELETE CASCADE NOT NULL,
    request_status VARCHAR(20) DEFAULT 'pending' CHECK (request_status IN ('pending', 'approved', 'rejected')),
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create fund_transactions table
CREATE TABLE public.fund_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name VARCHAR(100) NOT NULL,
    utr_id VARCHAR(100) UNIQUE NOT NULL,
    transaction_time TIMESTAMP DEFAULT NOW(),
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0)
);

-- Create gallery table
CREATE TABLE public.gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES public.users_profile (id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create social_links table
CREATE TABLE public.social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create site_metrics table
CREATE TABLE public.site_metrics (
    id SERIAL PRIMARY KEY,
    total_funds DECIMAL(12,2) DEFAULT 0,
    total_pets_adopted INT DEFAULT 0,
    total_pets_donated INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adoption_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fund_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_metrics ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for users_profile
CREATE POLICY "Users can view their own profile"
ON public.users_profile FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.users_profile FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.users_profile FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pets
CREATE POLICY "Anyone can view approved pets"
ON public.pets FOR SELECT
USING (status = 'approved' OR status = 'adopted');

CREATE POLICY "Users can view their donated pets"
ON public.pets FOR SELECT
USING (donor_id IN (SELECT id FROM public.users_profile WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all pets"
ON public.pets FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all pets"
ON public.pets FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donation_requests
CREATE POLICY "Users can view their own donation requests"
ON public.donation_requests FOR SELECT
USING (user_id IN (SELECT id FROM public.users_profile WHERE user_id = auth.uid()));

CREATE POLICY "Users can create donation requests"
ON public.donation_requests FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.users_profile WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all donation requests"
ON public.donation_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage donation requests"
ON public.donation_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for adoption_requests
CREATE POLICY "Users can view their own adoption requests"
ON public.adoption_requests FOR SELECT
USING (user_id IN (SELECT id FROM public.users_profile WHERE user_id = auth.uid()));

CREATE POLICY "Users can create adoption requests"
ON public.adoption_requests FOR INSERT
WITH CHECK (user_id IN (SELECT id FROM public.users_profile WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all adoption requests"
ON public.adoption_requests FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage adoption requests"
ON public.adoption_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for fund_transactions
CREATE POLICY "Admins can view all transactions"
ON public.fund_transactions FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage transactions"
ON public.fund_transactions FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for gallery
CREATE POLICY "Anyone can view gallery"
ON public.gallery FOR SELECT
USING (true);

CREATE POLICY "Admins can manage gallery"
ON public.gallery FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for social_links
CREATE POLICY "Anyone can view social links"
ON public.social_links FOR SELECT
USING (true);

CREATE POLICY "Admins can manage social links"
ON public.social_links FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for site_metrics
CREATE POLICY "Anyone can view metrics"
ON public.site_metrics FOR SELECT
USING (true);

CREATE POLICY "Admins can update metrics"
ON public.site_metrics FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users_profile
CREATE TRIGGER trg_update_profile_timestamp
BEFORE UPDATE ON public.users_profile
FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into users_profile
  INSERT INTO public.users_profile (user_id, full_name, email, phone, address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default social links
INSERT INTO public.social_links (platform, url)
VALUES
('Instagram', 'https://www.instagram.com/solapurpet'),
('WhatsApp Community', 'https://chat.whatsapp.com/DoiiNrPW3cFE1Guon2AWIL'),
('YouTube', 'https://youtu.be/vJyGVfdaHlE');

-- Insert initial site metrics
INSERT INTO public.site_metrics (total_funds, total_pets_adopted, total_pets_donated)
VALUES (0, 0, 0);