import { auth } from "@/lib/auth"

import LocationPicker from "@/components/Map"

export default async function welcome() {
    const session = await auth();
    if(!session.user) return <div>please logIn</div>
    
    
    return (
        <div>
            <LocationPicker user={session?.user}  />
        </div>
    );
}