CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  role          TEXT CHECK (role IN ('farmer','buyer')) NOT NULL,
  name          TEXT NOT NULL,
  phone         TEXT,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION
);

CREATE TABLE waste_listings (
  id            SERIAL PRIMARY KEY,
  farmer_id     INT REFERENCES users(id),
  residue_type  TEXT NOT NULL,
  quantity_tonnes NUMERIC(10,2) NOT NULL,
  location_text TEXT,
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  image_url     TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE buyer_requirements (
  id            SERIAL PRIMARY KEY,
  buyer_id      INT REFERENCES users(id),
  residue_type  TEXT NOT NULL,
  quantity_tonnes NUMERIC(10,2) NOT NULL,
  radius_km     INT DEFAULT 50,
  active        BOOLEAN DEFAULT TRUE
);

CREATE TABLE matches (
  id              SERIAL PRIMARY KEY,
  listing_id      INT REFERENCES waste_listings(id),
  requirement_id  INT REFERENCES buyer_requirements(id),
  distance_km     NUMERIC(8,2),
  value_min       NUMERIC(12,2),
  value_max       NUMERIC(12,2),
  score           NUMERIC(6,3),
  status          TEXT DEFAULT 'proposed' CHECK (status IN ('proposed','accepted','rejected'))
);

CREATE TABLE pickup_requests (
  id            SERIAL PRIMARY KEY,
  match_id      INT REFERENCES matches(id),
  status        TEXT DEFAULT 'requested' CHECK (status IN ('requested','scheduled','picked_up','delivered')),
  scheduled_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);
