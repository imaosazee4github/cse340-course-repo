CREATE TABLE organization(
organization_id SERIAL PRIMARY KEY,
organization_name VARCHAR(150) NOT NULL,
organization_description TEXT NOT NULL,
organization_email VARCHAR(255) NOT NULL,
organization_logo VARCHAR(255) NOT NULL
);

INSERT INTO organization (
    organization_name,
    organization_description,
    organization_email,
    organization_logo
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);