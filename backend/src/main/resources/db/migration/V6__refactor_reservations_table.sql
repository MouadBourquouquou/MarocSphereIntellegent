-- V6: Refactor reservations table to support multiple resource types
-- Replaces guide_id FK with generic resourceType + resourceId + resourceName

-- Step 1: Add new columns (nullable initially for data migration)
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS resource_type VARCHAR(32);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS resource_id BIGINT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS resource_name VARCHAR(255);

-- Step 2: Migrate existing guide reservations
UPDATE reservations
SET resource_type = 'GUIDE',
    resource_id = guide_id,
    resource_name = 'Guide #' || guide_id
WHERE guide_id IS NOT NULL AND resource_type IS NULL;

-- Step 3: Set defaults for any remaining rows without resource_type
UPDATE reservations
SET resource_type = 'GUIDE',
    resource_id = 0,
    resource_name = 'Réservation'
WHERE resource_type IS NULL;

-- Step 4: Standardize status values
UPDATE reservations SET statut = 'PENDING'    WHERE statut IN ('PENDING', 'EN_ATTENTE', 'Pending');
UPDATE reservations SET statut = 'CONFIRMED'  WHERE statut IN ('CONFIRMEE', 'Confirmed');
UPDATE reservations SET statut = 'CANCELLED'  WHERE statut IN ('ANNULEE', 'Cancelled');
UPDATE reservations SET statut = 'COMPLETED'  WHERE statut IN ('COMPLETED', 'Completed');

-- Step 5: Make new columns NOT NULL
ALTER TABLE reservations ALTER COLUMN resource_type SET NOT NULL;
ALTER TABLE reservations ALTER COLUMN resource_id SET NOT NULL;
ALTER TABLE reservations ALTER COLUMN resource_name SET NOT NULL;
ALTER TABLE reservations ALTER COLUMN statut SET NOT NULL;

-- Step 6: Drop the old guide_id column
ALTER TABLE reservations DROP COLUMN IF EXISTS guide_id;

-- Step 7: Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_reservations_client ON reservations(client_id);
CREATE INDEX IF NOT EXISTS idx_reservations_statut ON reservations(statut);
CREATE INDEX IF NOT EXISTS idx_reservations_resource ON reservations(resource_type, resource_id);
