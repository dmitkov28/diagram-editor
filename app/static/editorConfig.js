export const values = [
    "from diagrams import Diagram",
    "from diagrams.aws.compute import EC2",
    "from diagrams.aws.database import RDS",
    "from diagrams.aws.network import ELB",
    "",
    "# Start editing the code below to generate a new diagram",
    "# Find more at:  https://diagrams.mingrammer.com/)",
    "",
    "with Diagram('Grouped Workers', direction='TB'):",
        "   ELB('lb') >> [EC2('worker1'),",
        "   EC2('worker2'),",
        "   EC2('worker3'),",
        "   EC2('worker4'),",
        "   EC2('worker5')] >> RDS('events')"
].join("\n")

