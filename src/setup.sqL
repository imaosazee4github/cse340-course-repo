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

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    project_description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

INSERT INTO service_project (
    organization_id,
    title,
    project_description,
    location,
    project_date
)
VALUES
(
    1,
    'Park Cleanup',
    'Community park environmental cleanup event.',
    'Central Park',
    '2026-06-15'
),
(
    1,
    'Tree Planting Initiative',
    'Planting trees across local neighborhoods.',
    'Greenfield',
    '2026-06-20'
),
(
    1,
    'Community Recycling Drive',
    'Promoting recycling awareness.',
    'City Hall',
    '2026-06-25'
),
(
    1,
    'Beach Cleanup',
    'Volunteer beach sanitation project.',
    'Ocean View Beach',
    '2026-07-01'
),
(
    1,
    'Environmental Awareness Campaign',
    'Teaching environmental sustainability.',
    'Community Center',
    '2026-07-05'
);