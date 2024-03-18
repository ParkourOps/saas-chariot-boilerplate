import DataInstantiator from "../libraries/data-instantiator"
import ProjectConfiguration from "../models/ProjectConfiguration"

const projectConfiguration = DataInstantiator.createConst(ProjectConfiguration, {
    application: {
        title: "SaaS Chariot",
        subtitle: "Rapidly Build and Launch Digital Products and Services",
        noReplyEmail: {
            displayName: "SaaS Chariot",
            email: "no_reply@saaschariot.com",
        }
    },
    seo: {
        description: "Rapidly Build and Launch Digital Products and Services...",
        themeColor: "#153243",
        preferredColorScheme: "light",
        featuredImage: {
            url: "https://firebasestorage.googleapis.com/v0/b/saas-chariot.appspot.com/o/seo-assets%2Fimages%2Flogo.png?alt=media&token=f78bc5f0-fe27-47e9-b12b-0735033c609d",
            alt: "The SaaS Chariot logo.",
        },        
    },
    contact: {
        company: {
            name: "Parkour Ops Ltd.",
            number: "14772189",
        },
        address: {
            lines: ["20-22 Wenlock Road", "London", "N1 7GU", "England", "United Kingdom"],
            geolocation: {
                latitude: 51.53065,
                longitude: -0.0936138,
            },
            timeZone: "Europe/London",
        },
        email: {
            displayName: "SaaS Chariot: Front Desk",
            email: "front_desk@saaschariot.com",
        },
    }
});

export default projectConfiguration;
