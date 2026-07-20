
CREATE TABLE plats (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prix NUMERIC(6,2) NOT NULL,
  categorie VARCHAR(50) NOT NULL,
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO plats (nom, prix, categorie) VALUES
('Tacos poulet', 35.00, 'Tacos'),
('Panini viande', 25.00, 'Sandwich'),
('Jus avocat', 15.00, 'Boissons'),
('Msemen', 5.00, 'Dessert');

