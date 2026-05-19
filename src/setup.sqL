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
2,
    'Urban Farming Workshop',
    'Teaching residents sustainable urban farming techniques.',
    'Greenfield Community Center',
    '2026-07-10'
),
(
    2,
    'Community Garden Expansion',
    'Expanding neighborhood garden spaces for local food production.',
    'Downtown Garden Park',
    '2026-07-15'
),
(
    2,
    'Youth Agriculture Training',
    'Hands-on farming education for teenagers.',
    'Harvest Learning Farm',
    '2026-07-20'
),
(
    2,
    'Healthy Food Awareness Campaign',
    'Promoting healthy eating and sustainable food practices.',
    'City Market Square',
    '2026-07-25'
),
(
    3,
    'Food Donation Drive',
    'Collecting and distributing food supplies to families in need.',
    'Community Hall',
    '2026-08-01'
),
(
    3,
    'Senior Care Outreach',
    'Providing support and companionship for senior citizens.',
    'Sunrise Senior Center',
    '2026-08-05'
),
(
    3,
    'Back-to-School Supply Program',
    'Distributing school supplies to underprivileged children.',
    'Unity Community Center',
    '2026-08-10'
),
(
    3,
    'Neighborhood Volunteer Day',
    'Organizing volunteers for local cleanup and repair projects.',
    'Westside Neighborhood',
    '2026-08-15'
);
 
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(150) NOT NULL
);

CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id),
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

INSERT INTO category (category_name)
VALUES
('Environmental'),
('Educational'),
('Community Service'),
('Health and Wellness');

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 3),
(4, 1),
(5, 1),
(6, 2),
(7, 1),
(8, 2),
(9, 4),
(10, 3),
(11, 4),
(12, 2),
(13, 3);