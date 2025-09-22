

import React, { useState, useRef } from 'react';
import type { LoginActivity, BillingHistoryItem } from '../types';
import { UserCircleIcon, LockClosedIcon, CreditCardIcon, BellAlertIcon, ShieldCheckIcon, TrashIcon, GlobeAltIcon } from '../components/Icons';

// Fix: Replaced JSX.Element with React.ReactNode to avoid namespace errors.
const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string; icon?: React.ReactNode; }> = ({ children, className = '', title, icon }) => (
    <div className={`bg-dark-card rounded-3xl p-6 transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-1 ${className}`}>
        {title && (
             <h2 className="text-lg font-bold mb-4 flex items-center">
                {icon && <span className="mr-3 text-accent-cyan">{icon}</span>}
                {title}
            </h2>
        )}
        {children}
    </div>
);

const InputField: React.FC<{ label: string; type: string; value: string; placeholder?: string }> = ({ label, type, value, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <input type={type} defaultValue={value} placeholder={placeholder} className="w-full bg-dark-bg border border-dark-border rounded-lg h-11 px-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
    </div>
);

const TextAreaField: React.FC<{ label: string; value: string; placeholder?: string; rows?: number }> = ({ label, value, placeholder, rows = 3 }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <textarea defaultValue={value} placeholder={placeholder} rows={rows} className="w-full bg-dark-bg border border-dark-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan" />
    </div>
);

const SelectField: React.FC<{ label: string; children: React.ReactNode; defaultValue: string }> = ({ label, children, defaultValue }) => (
    <div>
        <label className="block text-sm font-medium text-light-gray mb-1">{label}</label>
        <select defaultValue={defaultValue} className="w-full bg-dark-bg border border-dark-border rounded-lg h-11 px-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}>
            {children}
        </select>
    </div>
);


const Toggle: React.FC<{ label: string; description: string; enabled: boolean; }> = ({ label, description, enabled }) => (
     <div className="flex items-center justify-between">
        <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-light-gray">{description}</p>
        </div>
        <button className={`w-12 h-6 rounded-full flex items-center transition-colors ${enabled ? 'bg-accent-cyan justify-end' : 'bg-mid-gray justify-start'}`}>
            <span className="w-5 h-5 bg-white rounded-full block mx-0.5 transform transition-transform"></span>
        </button>
    </div>
);

const loginActivityData: LoginActivity[] = [
    { id: '1', device: 'Chrome on macOS', location: 'New York, USA', time: '2 hours ago', ip: '192.168.1.1' },
    { id: '2', device: 'Safari on iPhone', location: 'New York, USA', time: '1 day ago', ip: '192.168.1.1' },
];

const billingHistoryData: BillingHistoryItem[] = [
    { id: '1', date: '2024-09-01', description: 'Premium Plan Monthly Subscription', amount: 12.99 },
    { id: '2', date: '2024-08-01', description: 'Premium Plan Monthly Subscription', amount: 12.99 },
];


export const SettingsPage: React.FC = () => {
    const [avatarPreview, setAvatarPreview] = useState("https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mt-6 pb-6">
             <h1 className="text-2xl font-bold">Settings & Account</h1>
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <Card title="Profile Information" icon={<UserCircleIcon />}>
                        <div className="flex items-center space-x-6 mb-6">
                            <img src={avatarPreview} alt="Saiful Alam Rafi" className="w-24 h-24 rounded-full object-cover"/>
                            <div>
                                <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden"/>
                                <button onClick={handleUploadClick} className="bg-accent-cyan text-black font-semibold px-4 py-2 rounded-lg hover:bg-accent-cyan-light transition-colors">Upload new picture</button>
                                <p className="text-xs text-light-gray mt-2">PNG, JPG, GIF up to 10MB.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Full Name" type="text" value="Saiful Alam Rafi" />
                            <InputField label="Role" type="text" value="Founder/Admin" />
                            <InputField label="Email Address" type="email" value="saiful@sarlegacy.com" />
                            <InputField label="Phone Number" type="tel" value="+1 234 567 890" />
                            <div className="md:col-span-2">
                                <TextAreaField label="Bio" value="Experienced Founder and Admin with a demonstrated history of working in the computer software industry." placeholder="Tell us about yourself..." />
                            </div>
                            <InputField label="LinkedIn Profile" type="text" value="linkedin.com/in/saiful" />
                        </div>
                         <div className="text-right mt-4">
                            <button className="bg-white text-black font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">Save Changes</button>
                        </div>
                    </Card>
                    <Card title="Password & Security" icon={<LockClosedIcon />}>
                        <div className="space-y-4">
                             <InputField label="Current Password" type="password" value="" placeholder="••••••••" />
                             <InputField label="New Password" type="password" value="" placeholder="••••••••" />
                             <InputField label="Confirm New Password" type="password" value="" placeholder="••••••••" />
                        </div>
                         <hr className="border-dark-border my-6" />
                        <Toggle label="Two-Factor Authentication (2FA)" description="Add an extra layer of security to your account." enabled={true} />
                        <h3 className="font-semibold mt-6 mb-2">Login Activity</h3>
                        {loginActivityData.map(activity => (
                             <div key={activity.id} className="text-sm flex justify-between items-center p-3 hover:bg-dark-bg rounded-lg">
                                <div><p>{activity.device}</p><p className="text-light-gray">{activity.location} ({activity.ip})</p></div>
                                <p className="text-light-gray">{activity.time}</p>
                            </div>
                        ))}
                        <div className="mt-6 flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                            <div>
                                <h3 className="font-semibold">Sign out from all devices</h3>
                                <p className="text-sm text-light-gray">This will sign you out of all active sessions except this one.</p>
                            </div>
                            <button className="text-sm font-semibold bg-dark-border px-4 py-2 rounded-lg hover:bg-mid-gray transition-colors shrink-0">
                                Sign Out
                            </button>
                        </div>
                         <div className="text-right mt-4">
                            <button className="bg-white text-black font-bold px-5 py-2.5 rounded-xl hover:bg-gray-200 transition-colors">Update Password</button>
                        </div>
                    </Card>
                     <Card title="Account Management" icon={<TrashIcon />}>
                         <div className="space-y-4">
                             <div>
                                 <h3 className="font-semibold text-yellow-400">Deactivate Account</h3>
                                 <p className="text-sm text-light-gray mt-1">Temporarily disable your account. Your data will be preserved but you won't be able to log in.</p>
                                 <button className="mt-2 text-yellow-400 font-semibold text-sm hover:underline">Deactivate</button>
                             </div>
                             <div>
                                 <h3 className="font-semibold text-red-500">Delete Account</h3>
                                 <p className="text-sm text-light-gray mt-1">Permanently delete your account and all associated data. This action cannot be undone.</p>
                                  <button className="mt-2 text-red-500 font-semibold text-sm hover:underline">Delete my account</button>
                             </div>
                         </div>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                     <Card title="Notifications" icon={<BellAlertIcon />}>
                         <div className="space-y-4">
                             <Toggle label="New Orders" description="Notify me when a new order is placed." enabled={true} />
                             <Toggle label="Trade Updates" description="Notify me on P2P trade status changes." enabled={true} />
                             <Toggle label="Project Milestones" description="Notify on important project updates." enabled={false} />
                             <Toggle label="Team Mentions" description="Notify me when a team member @mentions you." enabled={true} />
                             <Toggle label="Security Alerts" description="Notify about unusual login activity." enabled={true} />
                         </div>
                    </Card>
                    <Card title="Language & Region" icon={<GlobeAltIcon />}>
                        <div className="space-y-4">
                            <SelectField label="Language" defaultValue="en-us">
                                <option value="en-us">English (United States)</option>
                                <option value="en-gb">English (United Kingdom)</option>
                                <option value="es-es">Español (España)</option>
                                <option value="fr-fr">Français (France)</option>
                            </SelectField>
                            <SelectField label="Timezone" defaultValue="est">
                                <option value="est">(GMT-5:00) Eastern Time</option>
                                <option value="pst">(GMT-8:00) Pacific Time</option>
                                <option value="gmt">(GMT+0:00) Greenwich Mean Time</option>
                                <option value="cet">(GMT+1:00) Central European Time</option>
                            </SelectField>
                        </div>
                    </Card>
                    <Card title="Billing & Plan" icon={<CreditCardIcon />}>
                        <div>
                            <p className="text-light-gray">Current Plan</p>
                            <p className="text-xl font-bold">Premium</p>
                            <p className="text-sm text-light-gray">৳12.99 per month, renews on 2024-10-01</p>
                            <button className="w-full mt-3 bg-accent-cyan text-black font-semibold py-2 rounded-lg hover:bg-accent-cyan-light transition-colors">Manage Subscription</button>
                        </div>
                        <hr className="border-dark-border my-6" />
                         <h3 className="font-semibold mb-2">Payment Method</h3>
                         <div className="flex items-center space-x-3 bg-dark-bg p-3 rounded-lg">
                            <CreditCardIcon className="w-8 h-8"/>
                            <div>
                                <p>Visa ending in 1234</p>
                                <p className="text-xs text-light-gray">Expires 12/2028</p>
                            </div>
                            <button className="ml-auto text-sm font-semibold hover:underline">Update</button>
                         </div>
                         <hr className="border-dark-border my-6" />
                         <h3 className="font-semibold mb-2">Billing History</h3>
                         {billingHistoryData.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm p-2 hover:bg-dark-bg rounded-lg">
                                <div><p>{item.description}</p><p className="text-light-gray">{item.date}</p></div>
                                <div className="flex items-center gap-4">
                                    <p className="font-semibold">৳{item.amount.toFixed(2)}</p>
                                    <button className="text-xs font-semibold text-accent-cyan hover:underline">Download</button>
                                </div>
                            </div>
                         ))}
                    </Card>
                </div>
            </div>
        </div>
    );
};