import { Layout } from '~/layouts';
import { Animate, List } from '~/components';
import { ListActionType } from '~/types';

import type { GetStaticProps } from 'next';
import type { ListAction } from '~/types';

interface WorkExperience {
  id: string;
  name: string;
  description: string;
  role: string;
  period: string;
  achievements: string[];
  technologies: string[];
  icon: string;
  url?: string;
  post?: string;
  homepage?: string;
}

interface ExperienceProps {
  stringifiedExperiences: string;
}

export const getStaticProps: GetStaticProps<ExperienceProps> = async () => {
  // Replace with your actual work experiences
  const experiences: WorkExperience[] = [
    {
      id: 'amazon',
      name: 'Amazon',
      role: 'Principal Architect',
      period: 'March 2025 - Present',
      description: 'Engineered robust AWS services managing trillions of daily requests',
      achievements: [
        'Optimized Amazon S3 (100T+ objects, millions/sec throughput)',
        'Led architecture for distributed systems handling massive scale',
        'Improved system efficiency by 40% through architectural redesign'
      ],
      technologies: ['Java', 'Kotlin'],
      icon: '🏢',
      url: 'https://www.amazon.com'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      role: 'Senior Software Engineer',
      period: 'Feb 2025 - Present',
      description: 'Built fault-tolerant backend systems processing 15-20M requests/day',
      achievements: [
        'Implemented high-availability payment processing systems',
        'Reduced system latency by 30% through optimization',
        'Designed fraud detection mechanisms saving $2M annually'
      ],
      technologies: ['C++', 'Golang', 'Java'],
      icon: '💳',
      url: 'https://www.paypal.com'
    },
    {
      id: 'wells-fargo',
      name: 'Wells Fargo',
      role: 'Software Engineer',
      period: 'March 2025 - Present',
      description: 'Developed secure banking/payment systems with Java',
      achievements: [
        'Enhanced transaction integrity with cryptographic solutions',
        'Implemented fraud detection algorithms reducing false positives by 25%',
        'Automated reconciliation processes saving 200+ hours/month'
      ],
      technologies: ['Java', 'Security', 'Cryptography'],
      icon: '🏦',
      url: 'https://www.wellsfargo.com'
    }
  ];

  return {
    props: {
      stringifiedExperiences: JSON.stringify(experiences),
    },
    revalidate: 3600,
  };
};

export default function ExperiencePage({ stringifiedExperiences }: ExperienceProps): JSX.Element {
  const experiences = JSON.parse(stringifiedExperiences) as WorkExperience[];

  return (
    <Layout.Default seo={{ title: 'Krish Pranav ─ Professional Experience' }}>
      <div className="my-24 mx-2 sm:mx-6 lg:mb-28 lg:mx-8">
        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Professional Experience
          </h1>
          
          <List.Container>
            {experiences.map((experience, index) => (
              <Animate
                animation={{ y: [50, 0], opacity: [0, 1] }}
                key={experience.id}
                transition={{
                  delay: 0.1 * index,
                }}
              >
                <List.Item
                  actions={[
                    ...(experience.url
                      ? [
                          {
                            type: ListActionType.LINK,
                            external: true,
                            href: experience.url,
                            icon: 'feather:external-link',
                            label: `${experience.name} website`,
                          } as ListAction,
                        ]
                      : []),
                    ...(experience.post
                      ? [
                          {
                            type: ListActionType.LINK,
                            external: false,
                            href: experience.post,
                            icon: 'feather:edit-3',
                            label: `Blog post about ${experience.name}`,
                          } as ListAction,
                        ]
                      : []),
                  ]}
                  description={
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{experience.role}</span>
                        <span className="text-gray-500 dark:text-gray-400">•</span>
                        <span className="text-gray-500 dark:text-gray-400">{experience.period}</span>
                      </div>
                      <p>{experience.description}</p>
                      <div className="mt-2">
                        <h4 className="font-medium mb-1">Key Achievements:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {experience.achievements.map((achievement, i) => (
                            <li key={i}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium mb-1">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.map((tech, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                  icon={<span className="text-2xl">{experience.icon}</span>}
                  title={experience.name}
                />
              </Animate>
            ))}
          </List.Container>
        </div>
      </div>
    </Layout.Default>
  );
}