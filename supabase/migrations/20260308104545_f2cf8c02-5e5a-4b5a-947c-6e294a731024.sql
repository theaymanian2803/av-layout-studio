ALTER TABLE orders DROP CONSTRAINT orders_status_check;

ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'pending_cod', 'pending_paypal', 'processing', 'shipped', 'delivered', 'cancelled', 'paid', 'payment_failed'));