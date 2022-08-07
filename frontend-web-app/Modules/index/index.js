import { useRouter } from "next/router";

const socialLinks = [
    {
        content: "Join the DAO",
        link: "https://pozzleplanet.typeform.com/signup",
        external: true,
    },
    {
        content: "$POZ Pre-Sale",
        link: "https://medium.com/@pozzleplanet/astr0s-the-first-omnichain-nft-protocol-drop-808e9b64bf0d",
        external: true,
    },
    {
        content: "Pozzlenaut Mint",
        link: "/mint",
        external: false,
    },
    {
        content: "Medium",
        link: "https://medium.com/@pozzleplanet",
        external: true,
    },
    {
        content: "Twitter",
        link: "https://twitter.com/pozzleplanet",
        external: true,
    },
    {
        content: "Discord",
        link: "https://discord.gg/PozzlePlanet",
        external: true,
    },
]

const LinkText = ({ link, content, external }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(link);
    };

    return (
        <div className="w-4/5 my-3 py-2 px-2 rounded-2xl bg-app-purple-light mx-auto cursor-pointer hover:bg-white link-text">
            {external ? (
                <a href={link} target="_blank" rel="noreferrer" className="flex justify-content-center w-100 link_text">
                    {content}
                </a>
            ) : (
                <a onClick={handleClick} className="flex justify-content-center w-100 link_text">
                    {content}
                </a>
            )}
        </div>
    )
}

const Home = () => {
    return (
        <div className="homePage">
            <div className="relative h-100 overflow-auto">
                <div className="phone_wrapper">
                    <img src="/img/home/circle_left.png" alt="circle left" className="absolute left-0 top-40 sm:top-24 h-40 sm:h-1/2 md:h-2/5 lg:h-2/3 left_img" />
                    <img src="/img/home/circle_right.png" alt="circle right" className="absolute right-0 top-40 sm:top-16 lg:top-10 h-1/3 sm:h-2/3 md:h-3/5 lg:h-5/6 right_img" />
                    <img src="/img/home/circle_bottom.png" alt="circle bottom" className="fixed left-1/6 bottom-0 w-1/3 md:w-2/3 xl:w-1/3 bottom_img" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-24 w-3/4 xl:w-1/2 logo_part">
                        <img src="/img/home/text_logo.svg" alt="text logo" className="w-100 logo_pozzle" />
                        <img src="/img/home/text_pozzle.png" alt="pozzle text" className="w-100 transform -translate-x-4 lg:-translate-x-8 text_pozzle" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-12 sm:top-18 md:top-28 xl:top-28 2xl:top-40 h-99 w-80 sm:w-96 large_viewpoint_external_box">
                            <img src="/img/home/phone.png" alt="phone" className="absolute top-0 h-100 w-100" />
                            <img src="/img/home/pozzle_logo.png" alt="logo" className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1/4 pozzle_logo" />
                            <div className="absolute top-52 left-1/2 transform -translate-x-1/2 w-100">
                                {
                                    socialLinks.map((item, key) => (
                                        <LinkText key={`link-text-${key}`} {...item} />
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
