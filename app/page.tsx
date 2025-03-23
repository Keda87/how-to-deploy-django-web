import { DeploymentWizard } from "@/components/deployment-wizard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto py-10 px-4">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 mb-4">
            <svg
              className="django-logo"
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMinYMin meet"
            >
              <g>
                <path d="M186.38 230.635h-31.03v-92.593c-17.895 5.305-31.023 7.326-45.388 7.326-42.979 0-65.53-19.442-65.53-56.953 0-36.158 23.576-59.733 60.12-59.733 14.36 0 25.798 2.86 41.825 9.95V0h31.03v230.635h9.973v.003zm-31.03-172.871c-13.027-6.17-23.842-8.608-35.288-8.608-26.622 0-41.825 16.222-41.825 44.493 0 27.725 14.521 42.986 40.9 42.986 11.445 0 22.89-1.925 36.213-6.169V57.764z"></path>
              </g>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-center">Django Deployment Wizard</h1>
          <p className="text-muted-foreground mt-2 text-center max-w-lg">
            A step-by-step guide to help you deploy your Django application in production
          </p>
        </div>
        <DeploymentWizard />
      </div>
    </main>
  )
}

