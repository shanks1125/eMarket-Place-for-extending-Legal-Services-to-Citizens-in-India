import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User, ArrowLeft, Clock, Share2 } from "lucide-react";

const blogArticles = [
  {
    id: 1,
    title: "Understanding Property Title Verification in India",
    excerpt: "A comprehensive guide to verifying property titles, checking encumbrances, and ensuring clear ownership before purchase.",
    category: "Property Documentation",
    author: "Legal Team",
    date: "2024-01-15",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
    content: `
# Understanding Property Title Verification in India

Property title verification is one of the most critical steps in any real estate transaction in India. Whether you're buying agricultural land, a residential plot, or commercial property, ensuring clear and marketable title is essential to avoid future legal disputes.

## What is Title Verification?

Title verification is the process of examining the legal ownership history of a property to ensure that the seller has the legal right to sell it and that there are no outstanding claims, liens, or encumbrances on the property.

## Key Documents Required for Title Verification

### 1. Sale Deed
The sale deed is the primary document that establishes ownership. It should be registered with the Sub-Registrar's office and contain:
- Complete details of the buyer and seller
- Property description and boundaries
- Consideration amount
- Signatures of witnesses

### 2. Encumbrance Certificate (EC)
An EC shows all registered transactions on the property for a specified period, typically 13-30 years. It reveals:
- Previous sales
- Mortgages
- Liens
- Legal disputes

### 3. Property Tax Receipts
Recent property tax receipts prove that:
- The seller is the current owner
- All municipal taxes are paid up to date
- There are no outstanding dues

### 4. Approved Building Plans
For constructed properties, verify:
- Building plan approval from local authority
- Completion certificate
- Occupancy certificate

## The Title Verification Process

### Step 1: Document Collection
Gather all property documents from the seller, including:
- Original title deeds
- Chain of ownership documents (past 30 years minimum)
- Tax receipts and utility bills
- NOCs from relevant authorities

### Step 2: Title Search
Conduct a thorough title search at the Sub-Registrar's office to:
- Verify the chain of ownership
- Check for any registered encumbrances
- Identify potential title defects

### Step 3: Encumbrance Check
Obtain an Encumbrance Certificate for at least 13-30 years to ensure:
- No pending mortgages
- No legal disputes registered
- Clear title transfer in each transaction

### Step 4: Physical Verification
Visit the property site to:
- Match physical boundaries with document descriptions
- Check for unauthorized occupants
- Verify municipal records

### Step 5: Legal Opinion
Engage a property lawyer to:
- Review all documents
- Identify potential legal issues
- Provide a title clearance certificate

## Common Title Defects

### 1. Break in Chain of Ownership
Missing documents in the ownership history can cloud the title. Every transfer should be properly documented and registered.

### 2. Unresolved Legal Disputes
Pending litigation can prevent clear title transfer. Check for:
- Court cases involving the property
- Stay orders
- Injunctions

### 3. Encumbrances and Liens
Outstanding mortgages or liens must be cleared before purchase:
- Bank mortgages
- Private loans secured against property
- Government dues

### 4. Inheritance Issues
Properties inherited without proper succession documents can have multiple claimants:
- Unregistered wills
- Disputed family settlements
- Minor heirs

### 5. Unauthorized Constructions
Buildings constructed without proper approvals can lead to:
- Demolition orders
- Penalties and fines
- Inability to obtain occupancy certificate

## Red Flags to Watch For

⚠️ **Warning Signs:**
- Seller refusing to provide documents
- Documents with suspicious alterations
- Multiple power of attorney sales
- Unusually low price
- Pressure to complete transaction quickly
- Missing link documents in chain of ownership

## State-Specific Considerations

### Karnataka
- Requires 13-year EC for urban properties
- Khata certificate from BBMP/local authority mandatory
- Conversion orders for agricultural land

### Maharashtra
- 30-year title search recommended
- 7/12 extract for agricultural land
- Property card from municipal corporation

### Tamil Nadu
- Patta and chitta for land verification
- Encumbrance certificate for 30 years
- Sale permission from district collector for agricultural land

### Delhi
- Freehold vs. leasehold distinction important
- DDA/MCD conversion certificates
- Property ID card

## Cost of Title Verification

The cost varies by location and property value:
- Lawyer fees: ₹5,000 - ₹50,000
- Document search charges: ₹2,000 - ₹10,000
- EC charges: ₹100 - ₹500 per document
- Physical verification: ₹2,000 - ₹5,000

## Timeline

Complete title verification typically takes:
- Document collection: 1-2 weeks
- Title search: 1-2 weeks
- Legal opinion: 1 week
- **Total: 3-5 weeks for thorough verification**

## Conclusion

Property title verification is not just a legal formality—it's your protection against future disputes and financial losses. Always engage qualified property lawyers and never rush through this crucial process. The time and money spent on thorough title verification is a wise investment that ensures peaceful ownership for generations.

### Need Help with Title Verification?

Connect with experienced property lawyers on our platform who specialize in title verification and can guide you through every step of the process.
    `
  },
  {
    id: 2,
    title: "Common Land Boundary Disputes and How to Resolve Them",
    excerpt: "Learn about the most frequent types of boundary disputes between neighbors and the legal remedies available.",
    category: "Boundary Issues",
    author: "Legal Team",
    date: "2024-01-12",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800",
    content: `
# Common Land Boundary Disputes and How to Resolve Them

Boundary disputes are among the most common and emotionally charged property conflicts in India. These disputes arise when neighbors disagree about the exact location of the property line dividing their lands.

## Types of Boundary Disputes

### 1. Encroachment
When a neighbor's structure or fence extends onto your property:
- Unauthorized construction
- Fence placement beyond boundaries
- Driveway or pathway encroachment
- Tree roots or branches crossing boundaries

### 2. Disputed Boundaries
Disagreement about where the actual boundary line lies:
- Unmarked or unclear boundaries
- Lost or moved boundary markers
- Discrepancies between documents and ground reality
- Historical confusion in property records

### 3. Adverse Possession Claims
When someone claims ownership of land through continuous, open possession:
- Occupying land for 12+ years (private property)
- Occupying government land for 30+ years
- Treating the land as their own openly

### 4. Rights of Way Disputes
Conflicts over access paths through another's property:
- Blocked traditional pathways
- Denied access to landlocked properties
- Unauthorized route usage

## Common Causes of Boundary Disputes

### Unclear or Missing Documentation
- Vague property descriptions in sale deeds
- Missing survey maps
- Contradictory measurements in documents
- Old documents using landmarks that no longer exist

### Natural Changes
- Erosion shifting riverbanks
- Land subsidence or elevation changes
- Natural disasters altering landscapes

### Survey Errors
- Incorrect measurements during subdivision
- Different surveyors producing varying results
- Use of outdated survey methods

### Intentional Encroachment
- Gradual boundary expansion
- Constructing beyond property lines
- Moving boundary markers

## Steps to Resolve Boundary Disputes

### Step 1: Review Documents
Gather and examine:
- Original sale deeds
- Survey maps and plans
- Property tax records
- Previous settlement documents

### Step 2: Conduct Professional Survey
Hire a licensed surveyor to:
- Accurately mark boundaries
- Create detailed boundary map
- Compare with registered documents
- Document encroachments if any

### Step 3: Negotiation
Attempt amicable resolution through:
- Direct discussion with neighbor
- Presenting survey findings
- Proposing boundary agreement
- Considering land exchange or purchase

### Step 4: Mediation
If negotiation fails:
- Engage neutral mediator
- Present evidence to mediator
- Explore settlement options
- Draft settlement agreement

### Step 5: Legal Action
As last resort, file suit for:
- Declaration of boundaries
- Injunction against encroachment
- Removal of unauthorized structures
- Damages for trespass

## Legal Remedies Available

### 1. Suit for Declaration
Seek court declaration of correct boundaries based on:
- Title documents
- Survey evidence
- Historical records
- Expert testimony

### 2. Suit for Injunction
Prevent neighbor from:
- Continuing encroachment
- Obstructing your access
- Interfering with property use

### 3. Suit for Possession
Recover encroached portion through:
- Proving legal ownership
- Demonstrating encroachment
- Showing loss of possession

### 4. Criminal Complaint
File under IPC Section 447 (Criminal Trespass) for:
- Intentional encroachment
- Forcible entry
- Continuous trespass despite warning

## Evidence Required

### Documentary Evidence
- Title deeds with property descriptions
- Registered sale documents
- Survey maps and plans
- Tax payment records
- Previous court orders or settlements

### Physical Evidence
- Professional survey report
- Photographs of disputed area
- Boundary marker locations
- Structures in dispute

### Testimonial Evidence
- Eyewitness accounts
- Expert surveyor testimony
- Historical occupant statements
- Local authority records

## Preventing Boundary Disputes

### At Purchase
- Obtain professional survey before buying
- Verify boundaries match documents
- Check for encroachments
- Get boundary certificate from surveyor

### After Purchase
- Mark boundaries clearly with permanent markers
- Maintain boundary fence or wall
- Keep all property documents safe
- Address encroachments immediately
- Maintain good relations with neighbors

### Regular Maintenance
- Periodically verify boundaries
- Document any changes or disputes
- Keep photographs of boundaries
- Update survey if needed

## Timeline and Costs

### Mediation
- Duration: 2-6 months
- Cost: ₹10,000 - ₹50,000

### Court Litigation
- Duration: 2-7 years
- Cost: ₹50,000 - ₹5,00,000+
- Depends on: Property value, complexity, appeals

### Survey Costs
- Basic survey: ₹5,000 - ₹20,000
- Detailed boundary survey: ₹15,000 - ₹50,000
- Expert court testimony: Additional ₹20,000 - ₹1,00,000

## State-Specific Laws

### Karnataka
- Karnataka Land Revenue Act
- Survey and Settlement Rules
- Revenue Department handles boundary disputes

### Maharashtra
- Maharashtra Land Revenue Code
- Boundary disputes under Tahsildar jurisdiction
- Appeal process through Sub-Divisional Officer

### Tamil Nadu
- Tamil Nadu Land Encroachment Act
- Revenue authorities mark boundaries
- District Collector has final authority

## Key Takeaways

✓ Document everything from day one
✓ Address encroachments immediately
✓ Always get professional survey
✓ Try negotiation before litigation
✓ Maintain good neighborly relations
✓ Keep all property documents safe
✓ Act promptly—delays weaken your case

## When to Consult a Lawyer

Seek legal advice immediately if:
- Neighbor refuses to acknowledge boundary
- Encroachment is significant
- Threats or intimidation occur
- Negotiations fail
- Property value is substantial
- Multiple parties are involved

### Connect with Boundary Dispute Lawyers

Our platform connects you with experienced advocates who specialize in resolving land boundary disputes efficiently and cost-effectively.
    `
  },
  {
    id: 3,
    title: "Essential Documents for Land Purchase in India",
    excerpt: "Complete checklist of documents required for buying agricultural land, residential plots, and commercial properties.",
    category: "Documentation",
    author: "Legal Team",
    date: "2024-01-10",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800",
    content: `
# Essential Documents for Land Purchase in India

Buying land in India requires careful verification of numerous documents to ensure clear title and avoid future legal complications. This comprehensive guide covers all essential documents you need to check before purchasing land.

## Primary Ownership Documents

### 1. Sale Deed / Title Deed
The most important document proving ownership:
- Must be registered with Sub-Registrar
- Contains complete property description
- Shows chain of ownership
- **Verify**: All previous owners' names match
- **Check for**: Proper stamps and registration

### 2. Mother Deed
The original document creating the property:
- First registered sale deed
- Subdivision approval if applicable
- Foundation of property's legal existence
- **Essential for**: Tracing complete ownership history

### 3. Chain of Title Documents
All previous sale deeds for minimum 30 years:
- Establishes unbroken ownership chain
- Shows all transfers and transactions
- Identifies potential title defects
- **Critical for**: Ensuring marketable title

## Encumbrance Verification

### Encumbrance Certificate (EC)
Shows all registered transactions on the property:
- **Period**: Minimum 13-30 years depending on state
- **Reveals**: Mortgages, sales, liens, legal issues
- **Obtain from**: Sub-Registrar's office
- **Cost**: ₹100-500 per document

### What EC Shows:
✓ All sales and transfers
✓ Mortgage or loan records
✓ Court orders or legal notices
✓ Any encumbrances or charges

## Property Tax Records

### Tax Payment Receipts
Proof of paid property taxes:
- Last 3-5 years' receipts
- Shows seller is current owner
- Confirms no outstanding dues
- **Required for**: Property transfer

### Property Tax Assessment
- Municipal property card
- Current tax assessment order
- Property identification number
- **Verify**: Matches property details

## Land Revenue Documents

### For Agricultural Land

#### 7/12 Extract (Maharashtra)
- Shows land ownership details
- Mentions cultivation rights
- Records mutations and transfers
- Updated after each transaction

#### Patta and Chitta (Tamil Nadu)
- **Patta**: Ownership document
- **Chitta**: Survey document with details
- Both required for land verification

#### Khata Certificate (Karnataka)
- **A Khata**: For properties with approved plans
- **B Khata**: For properties without proper approvals
- Required for property tax payment
- Essential for property transfer

#### Record of Rights (Various States)
- Shows ownership and cultivation rights
- Updated by revenue department
- Required for land transactions
- **Different names**: Jamabandi, Khasra, Pahani

## Approval Documents

### For Residential/Commercial Plots

#### Layout Approval
- Approved by local development authority
- Shows plot division and dimensions
- Includes common areas and amenities
- **Verify**: Plot number matches sale deed

#### Conversion Certificate
- Converts agricultural land to non-agricultural
- Required for construction
- **Issued by**: Revenue department
- **Essential**: Before building anything

#### Commencement Certificate
- Permission to start construction
- Issued by local municipality
- Based on approved building plans
- **Check**: Validity period

#### Occupancy Certificate
- For constructed properties
- Confirms building as per approved plans
- Required for utilities connection
- **Indicates**: Construction is legal

## NOCs and Clearances

### 1. Land Use Certificate
- Current classification of land
- Permitted uses
- Any restrictions
- **Issued by**: Local planning authority

### 2. Betterment Charges Receipt
- For properties in development areas
- Shows charges paid to authority
- **Required in**: Newly developed localities

### 3. Property ID
- Unique identifier for property
- Links all records
- Required for online services
- **Obtain from**: Local municipal body

### 4. Non-Agriculture Assessment
- For converted agricultural land
- Confirms land use change
- Payment proof of conversion fees
- **Needed**: Before non-farm use

## Additional Important Documents

### Survey Documents

#### Survey Map
- Shows exact plot boundaries
- Contains measurements and dimensions
- Prepared by licensed surveyor
- **Should match**: Registered documents

#### Boundary Marking Certificate
- Confirms physical boundaries
- Identifies adjacent properties
- Shows access roads
- **Get**: Fresh survey before purchase

### Legal Clearances

#### Court Clearance
- No pending litigation certificate
- **Search**: Local courts for property cases
- **Essential**: Ensures property not in dispute

#### NOC from Society/Builder
- For plots in gated communities
- Confirms all dues paid
- Shows no objection to transfer
- **Check**: Society's legal status

### Loan-Related Documents (if applicable)

#### No Objection Certificate from Bank
- **If**: Seller has active loan
- Confirms loan can be transferred/closed
- Shows current outstanding amount
- **Required**: Before registration

## State-Specific Additional Documents

### Karnataka
- Khata certificate (A/B Khata)
- Conversion order
- Betterment charges receipt
- RTC (Record of Rights)

### Maharashtra
- 7/12 extract
- 8A extract
- Property card
- Non-agricultural assessment

### Tamil Nadu
- Patta
- Chitta
- Adangal
- FMB sketch

### Delhi
- Mutation certificate
- Conversion certificate
- Allotment letter (if DDA/NDMC)
- Sale permission

### Uttar Pradesh
- Khasra/Khatoni
- Revenue map
- Mutation certificate
- Conversion certificate

## Document Verification Checklist

### Before Making Offer
☐ Verify seller is registered owner
☐ Check last 30 years chain of title
☐ Obtain encumbrance certificate
☐ Verify property tax payments
☐ Check for any legal disputes

### Before Payment
☐ Professional survey conducted
☐ All required NOCs obtained
☐ Loan clearance if applicable
☐ No illegal constructions
☐ Clear and marketable title confirmed

### Before Registration
☐ All documents in original
☐ Power of attorney verified (if any)
☐ Seller's identity proof
☐ Payment receipts of all dues
☐ Required NOCs attached

## Red Flags to Watch

⚠️ **Warning Signs:**
- Gaps in ownership chain
- Multiple power of attorney transactions
- Pending court cases
- Unpaid property taxes
- Encroachment or boundary issues
- Suspicious alterations in documents
- Missing crucial certificates
- Seller's reluctance to provide documents

## Professional Help

### When to Hire Professionals

#### Property Lawyer
- Review all documents
- Conduct title search
- Provide legal opinion
- Draft sale agreement
- **Cost**: ₹10,000 - ₹1,00,000

#### Licensed Surveyor
- Verify boundaries
- Prepare survey map
- Identify encroachments
- **Cost**: ₹5,000 - ₹50,000

#### Document Verification Service
- Complete document check
- Court record search
- Encumbrance verification
- **Cost**: ₹5,000 - ₹25,000

## Timeline for Document Collection

### Initial Phase (1-2 weeks)
- Sale deed and title documents
- Property tax receipts
- Basic ownership verification

### Detailed Verification (2-3 weeks)
- Encumbrance certificate
- Chain of title documents
- Revenue records
- Survey verification

### Final Clearance (1-2 weeks)
- NOCs and approvals
- Legal opinion
- Court clearance
- Final documentation

**Total Time: 4-7 weeks for thorough verification**

## Document Storage

### After Purchase
- Keep originals in bank locker
- Make multiple certified copies
- Scan all documents digitally
- Store in cloud backup
- Update annually

## Cost Summary

| Document | Cost Range |
|----------|-----------|
| Encumbrance Certificate | ₹100-500 per doc |
| Survey Map | ₹5,000-25,000 |
| Legal Opinion | ₹10,000-50,000 |
| Document Search | ₹2,000-10,000 |
| Various NOCs | ₹1,000-5,000 each |
| **Total** | **₹20,000-1,00,000** |

## Conclusion

Thorough document verification is crucial for safe land purchase. Never rush this process, and always engage qualified professionals. The investment in proper verification prevents costly legal battles and ensures peaceful ownership.

### Need Help with Document Verification?

Connect with experienced property lawyers on our platform who can guide you through the entire documentation process.
    `
  }
];

export default function BlogPost() {
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    const foundArticle = blogArticles.find(a => a.id === articleId);
    if (foundArticle) {
      setArticle(foundArticle);
      const related = blogArticles
        .filter(a => a.id !== articleId && a.category === foundArticle.category)
        .slice(0, 3);
      setRelatedArticles(related);
    } else {
      navigate(createPageUrl("Blog"));
    }
  }, [navigate]);

  if (!article) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to={createPageUrl("Blog")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="h-96 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="p-8 lg:p-12">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge variant="outline">{article.category}</Badge>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-800 mb-6">{article.title}</h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">{article.excerpt}</p>

            {/* Full Content - Markdown-like rendering */}
            <div className="prose prose-lg max-w-none">
              {article.content.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-3xl font-bold text-slate-800 mt-8 mb-4">{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-slate-800 mt-6 mb-3">{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold text-slate-700 mt-5 mb-2">{line.substring(4)}</h3>;
                } else if (line.startsWith('#### ')) {
                  return <h4 key={index} className="text-lg font-semibold text-slate-700 mt-4 mb-2">{line.substring(5)}</h4>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6 mb-1 text-gray-700">{line.substring(2)}</li>;
                } else if (line.startsWith('✓ ')) {
                  return <div key={index} className="flex items-start gap-2 mb-2"><span className="text-green-600 font-bold">✓</span><span className="text-gray-700">{line.substring(2)}</span></div>;
                } else if (line.startsWith('⚠️ ')) {
                  return <div key={index} className="flex items-start gap-2 mb-2 text-red-600"><span>⚠️</span><span className="font-semibold">{line.substring(3)}</span></div>;
                } else if (line.startsWith('☐ ')) {
                  return <div key={index} className="flex items-start gap-2 mb-1"><span className="text-gray-400">☐</span><span className="text-gray-700">{line.substring(2)}</span></div>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={index} className="font-bold text-gray-800 my-3">{line.slice(2, -2)}</p>;
                } else if (line.includes('**')) {
                  const parts = line.split('**');
                  return (
                    <p key={index} className="text-gray-700 my-2">
                      {parts.map((part, i) => i % 2 === 0 ? part : <strong key={i} className="font-semibold">{part}</strong>)}
                    </p>
                  );
                } else if (line.startsWith('| ')) {
                  return <div key={index} className="text-sm text-gray-700 font-mono">{line}</div>;
                } else {
                  return <p key={index} className="text-gray-700 my-3 leading-relaxed">{line}</p>;
                }
              })}
            </div>

            {/* Share Buttons */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Card key={related.id} className="hover:shadow-lg transition-shadow bg-white">
                  <CardContent className="p-0">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={related.image} 
                        alt={related.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {related.category}
                      </Badge>
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {related.excerpt}
                      </p>
                      <Link to={createPageUrl(`BlogPost?id=${related.id}`)}>
                        <Button variant="outline" size="sm" className="w-full">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-slate-800 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Legal Assistance?</h2>
            <p className="text-gray-300 mb-6">
              Connect with experienced land dispute advocates who can help with your case
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("Providers")}>
                <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                  Find Advocates
                </Button>
              </Link>
              <Link to={createPageUrl("LegalChatbot")}>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-slate-800">
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}